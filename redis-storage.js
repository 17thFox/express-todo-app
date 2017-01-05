'use strict';

var Redis = require('ioredis');

const storageFileName = './storage.json';

var redis = new Redis({
    port: 6379, // Redis port
    host: '127.0.0.1' // Redis host
    // family: 4, // 4 (IPv4) or 6 (IPv6)
    // password: 'auth',
    // db: 0
});

// Generate a v4 UUID (random) 
// const uuidV4 = require('uuid/v4');
// uuidV4(); // -> '110ec58a-a0f2-4ac4-8393-c866d813b8d1' 

function loadFromRedis() {
    return new Promise(function(resolve, reject) {
        redis.get(storageFileName, function read(err, data) {
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

function saveToRedis(content) {
    savingPromise = savingPromise.then(function() {
        return new Promise(function(resolve, reject) {
            redis.set(storageFileName, JSON.stringify(content));
            resolve();
        });
    });

    return savingPromise;
}

module.exports = {
    saveToRedis: saveToRedis,
    loadFromRedis: loadFromRedis
};