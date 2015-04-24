'use strict';

var async = require('async'),
    Bluebird = require('bluebird');

module.exports = {
    description: 'Adicionando campo type ao tipo a tabela de tarefas',

    up: function(transaction, migrator, sequelize) {
        var queries = [
            "ALTER TABLE `tasks` ADD `type` ENUM('task','knowledgebase')  NOT NULL  DEFAULT 'task'  AFTER `description`;"
        ];

        return new Bluebird(function(resolve, reject) {
            async.eachSeries(queries, function(query, callback) {
                sequelize.query(query, null, {
                    transaction: transaction
                }).complete(callback);
            }, function(err) {
                if(err) {
                    return reject(err);
                }

                resolve();
            });
        });
    },

    down: function(transaction, migrator, sequelize) {
        var queries = [
            "SELECT 1;"
        ];

        return new Bluebird(function(resolve, reject) {
            async.eachSeries(queries, function(query, callback) {
                sequelize.query(query, null, {
                    transaction: transaction
                }).complete(callback);
            }, function(err) {
                if(err) {
                    return reject(err);
                }

                resolve();
            });
        });
    }
}