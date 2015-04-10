'use strict';

var async = require('async'),
    Bluebird = require('bluebird');

module.exports = {
    description: '',

    up: function(transaction, migrator, sequelize) {
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