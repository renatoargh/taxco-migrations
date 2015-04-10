'use strict';

var async = require('async'),
    Bluebird = require('bluebird');

module.exports = {
    description: 'Adicionado campo de telefone para envio de SMS',

    up: function(transaction, migrator, sequelize) {
        var queries = [
            "ALTER TABLE `users` ADD `telefone` VARCHAR(10)  NULL  DEFAULT NULL  AFTER `email`;",
            "ALTER TABLE `tasks` ADD `reviewRequest` TINYINT(1)  NOT NULL  DEFAULT '0'  AFTER `isOpen`;",
            "ALTER TABLE `tasks` ADD `notificationSentAt` DATETIME  NULL  AFTER `reviewRequest`;"
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
            "ALTER TABLE `users` DROP `telefone`;",
            "ALTER TABLE `tasks` DROP `reviewRequest`;",
            "ALTER TABLE `tasks` DROP `notificationSentAt`;"
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