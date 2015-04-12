'use strict';

var async = require('async'),
    Bluebird = require('bluebird');

module.exports = {
    description: 'Added fields to `visibility` table to track visualization and notifications status',

    up: function(transaction, migrator, sequelize) {
        var queries = [
            "ALTER TABLE `visibility` ADD `numberOfVisualizations` INT  NOT NULL  DEFAULT '0'  AFTER `taskId`;",
            "ALTER TABLE `visibility` ADD `visualizedAt` DATETIME  NULL  AFTER `numberOfVisualizations`;",
            "ALTER TABLE `visibility` ADD `smsSentAt` DATETIME  NULL  AFTER `visualizedAt`;",
            "ALTER TABLE `visibility` ADD `emailSentAt` DATETIME  NULL  AFTER `smsSentAt`;"
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
            "ALTER TABLE `visibility` DROP `emailSentAt`;",
            "ALTER TABLE `visibility` DROP `smsSentAt`;",
            "ALTER TABLE `visibility` DROP `visualizedAt`;",
            "ALTER TABLE `visibility` DROP `numberOfVisualizations`;"
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