'use strict';

var async = require('async'),
    Bluebird = require('bluebird');

module.exports = {
    description: 'Initial version of the database',

    up: function(transaction, migrator, sequelize) {
        var queries = [
            "CREATE TABLE `comments` (`id` int(11) NOT NULL AUTO_INCREMENT,`content` text NOT NULL,`createdAt` datetime NOT NULL,`updatedAt` datetime NOT NULL,`ownerId` int(11) DEFAULT NULL,`TaskId` int(11) DEFAULT NULL,PRIMARY KEY (`id`),UNIQUE KEY `id` (`id`),KEY `ownerId` (`ownerId`),KEY `TaskId` (`TaskId`)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;",
            "CREATE TABLE `tasks` (`id` int(11) NOT NULL AUTO_INCREMENT,`title` varchar(280) NOT NULL,`description` text NOT NULL,`isPublic` tinyint(1) NOT NULL DEFAULT '0',`isOpen` tinyint(1) NOT NULL DEFAULT '1',`createdAt` datetime NOT NULL,`updatedAt` datetime NOT NULL,`assignedToId` int(11) DEFAULT NULL,`ownerId` int(11) DEFAULT NULL,PRIMARY KEY (`id`),UNIQUE KEY `id` (`id`),KEY `assignedToId` (`assignedToId`),KEY `ownerId` (`ownerId`)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;",
            "CREATE TABLE `users` (`id` int(11) NOT NULL AUTO_INCREMENT,`name` varchar(75) NOT NULL,`email` varchar(50) NOT NULL,`role` enum('admin','user') NOT NULL DEFAULT 'user',`password` varchar(255) NOT NULL,`enabled` tinyint(1) NOT NULL DEFAULT '0',`lastInteraction` datetime DEFAULT NULL,`numberOfInteractions` int(11) DEFAULT '0',`createdAt` datetime NOT NULL,`updatedAt` datetime NOT NULL,PRIMARY KEY (`id`),UNIQUE KEY `id` (`id`),UNIQUE KEY `email` (`email`)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;",
            "CREATE TABLE `visibility` (`userId` int(11) NOT NULL DEFAULT '0',`taskId` int(11) NOT NULL DEFAULT '0',PRIMARY KEY (`userId`,`taskId`),KEY `taskId` (`taskId`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;",
            "ALTER TABLE `comments` ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE",
            "ALTER TABLE `comments` ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`TaskId`) REFERENCES `tasks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE",
            "ALTER TABLE `tasks` ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`assignedToId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE",
            "ALTER TABLE `tasks` ADD CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE",
            "ALTER TABLE `visibility` ADD CONSTRAINT `visibility_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE",
            "ALTER TABLE `visibility` ADD CONSTRAINT `visibility_ibfk_2` FOREIGN KEY (`taskId`) REFERENCES `tasks` (`id`)",
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

    // SET FOREIGN_KEY_CHECKS = 0;
    // SET GROUP_CONCAT_MAX_LEN = 32768;
    // SET @tables = NULL;
    // SELECT GROUP_CONCAT('`', table_name, '`') INTO @tables FROM information_schema.tables WHERE table_schema = (SELECT DATABASE());
    // SET @tables = CONCAT('DROP TABLE IF EXISTS ', @tables);
    // SELECT IFNULL(@tables, 'SELECT 1') INTO @tables;
    // PREPARE stmt FROM @tables;
    // EXECUTE stmt;
    // DEALLOCATE PREPARE stmt;
    // SET FOREIGN_KEY_CHECKS = 1;

    down: function(transaction, migrator, sequelize) {
        return sequelize.query([
            "SET FOREIGN_KEY_CHECKS = 0;",
            "SET GROUP_CONCAT_MAX_LEN = 32768;",
            "SET @tables = NULL;",
            "SELECT GROUP_CONCAT('`', table_name, '`') INTO @tables FROM information_schema.tables WHERE table_schema = (SELECT DATABASE());",
            "SET @tables = CONCAT('DROP TABLE IF EXISTS ', @tables);",
            "SELECT IFNULL(@tables, 'SELECT 1') INTO @tables;",
            "PREPARE stmt FROM @tables;",
            "EXECUTE stmt;",
            "DEALLOCATE PREPARE stmt;",
            "SET FOREIGN_KEY_CHECKS = 1;"
        ].join('\n'), null, {
            transaction: transaction
        });
    }
}