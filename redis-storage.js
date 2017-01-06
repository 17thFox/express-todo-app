'use strict';

var Redis = require('ioredis');

var redis = new Redis({
    port: 16049, // Redis port
    host: 'ec2-54-225-127-4.compute-1.amazonaws.com', // Redis host
    password: 'p6dd5e5ee0eaface1df6ef17b57ae6ef986955642b9e877ef67298d90591ab045'
});


function loadFromRedis(key) {
    return new Promise(function(resolve, reject) {
        redis.get(key, function read(err, data) {
            if (!data || data.length === 0) {
                return reject('There\'s nothing to see here');
            } else if (err) {
                return reject(err);
            }
            let content = JSON.parse(data);
            return resolve(content);
        });
    });
}

var savingPromise = Promise.resolve();

function saveToRedis(key, content) {
    savingPromise = savingPromise.then(function() {
        return new Promise(function(resolve, reject) {
            redis.set(key, JSON.stringify(content));
            resolve();
        });
    });

    return savingPromise;
}

module.exports = {
    saveToRedis: saveToRedis,
    loadFromRedis: loadFromRedis
};