'use strict';

const fs = require('fs');

const storageFileName = './storage.json';

function loadFromDisk() {
    return new Promise(function(resolve, reject) {
        fs.readFile(storageFileName,'utf-8', function read(err, data) {
            if (data.length === 0) {
                reject('There\'s nothing to see here');
            } else if (err) {
                reject(err);
            }
            let content = JSON.parse(data);
            resolve(content);
        });
    });
}

function saveToDisk(content) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(storageFileName, JSON.stringify(content), function(err) {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
}

module.exports = {
    saveToDisk: saveToDisk,
    loadFromDisk: loadFromDisk
};