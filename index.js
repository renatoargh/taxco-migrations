'use strict';

var Bluebird = require('Bluebird'),
    Umzug = require('umzug'),
    Sequelize = require('sequelize'),
    Moment = require('moment'),

    fs = require('fs'),
    path = require('path'),

    NODE_ENV = process.env.NODE_ENV;

function obterAmbiente(cliente, ambiente, callback) {
    // TODO: Substituir com uma ida no banco

    var ambientes = {
        bmsilva: {
            development: require('./development.json'),
            production: require('./production.json')
        }
    };

    callback(null, ambientes[cliente] && ambientes[cliente][ambiente]);
}

function obterMigrator(cliente, ambiente, callback) {
    obterAmbiente(cliente, ambiente, function(err, ambiente) {
        if(err) {
            return callback(err);
        }

        if(!ambiente) {
            return callback(new Error([
                'Não foi encontrada configuração para o cliente/ambiente fornecido'
            ].join('')));
        }

        var database = ambiente.db.mysql.database,
            user = ambiente.db.mysql.user,
            password = ambiente.db.mysql.password,
            sequelize = new Sequelize(database, user, password, {
                host: ambiente.db.mysql.host,
                port: ambiente.db.mysql.port,
                // TODO: Implementar logging distribuido
                logging: NODE_ENV === 'development' ? console.log : false,
                dialect: 'mysql',
                define: {
                    charset: 'utf8',
                    collation: 'utf8_general_ci'
                },
                dialectOptions: {
                    multipleStatements: true
                }
            });

        sequelize.transaction().then(function(transaction) {
            var umzug = new Umzug({
                storage: 'sequelize',
                storageOptions: {
                    sequelize: sequelize,
                    modelName: 'Migration',
                    tableName: 'migrations-schema',
                    columnName: 'version',
                    columnType: new Sequelize.STRING(100)
                },
                migrations: {
                    params: [transaction, sequelize.getQueryInterface(), sequelize],
                    path: path.join(__dirname, 'migrations'),
                    pattern: /^\d+[\w-]+\.js$/,
                    wrap: function (fn) {
                        // Descobrir melhor maneira para abrir e fechar a trasação
                        // Talvez usar _.wrap

                        // TODO: Eu preciso de uma transaction por migration
                        return fn;
                    }
                }
            });

            callback(null, transaction, umzug);
        });
    });
}

if(process.argv[2] === 'new') {
    var template = fs.readFileSync('migrationTemplate.js').toString(),
        now = new Moment(),
        filePath = path.join(__dirname, 'migrations', now.format('YYYYMMDDHHMMSS') + '.js');

    return fs.writeFileSync(filePath, template);
}

if(process.argv[2] && process.argv[3] && process.argv[4]) {
    var cliente = process.argv[2].toLowerCase(),
        ambiente = process.argv[3].toLowerCase(),
        metodo = process.argv[4].toLowerCase();

    if(['development', 'test', 'production'].indexOf(ambiente) === -1) {
        throw new Error('Ambiente deve ser: development, test ou production');
    }

    if(['up', 'down'].indexOf(metodo) === -1) {
        throw new Error('Método deve ser: up ou down');
    }

    obterMigrator(cliente, ambiente, function(err, transaction, migrator) {
        if(err) {
            throw err;
        }

        var migracao = migrator[metodo]();

        migracao.then(function() {
            transaction.commit();
            console.log('Migração concluída...');
            process.exit(0);
        });

        migracao.catch(function(err) {
            transaction.rollback();
            console.log('A migração não pode ser concluída');
            throw err;
        });
    });
} else {
    throw new Error('Um cliente, um ambiente e um método devem ser especificados');
}