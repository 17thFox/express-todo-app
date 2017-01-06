'use strict';

var Redis = require('ioredis');

var redis = new Redis({
    port: 6379, // Redis port
    host: '127.0.0.1' // Redis host
    // family: 4, // 4 (IPv4) or 6 (IPv6)
    // password: 'auth',
    // db: 0
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