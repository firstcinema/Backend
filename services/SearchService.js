const { algolia } = require('../config/keys');
const algoliasearch = require('algoliasearch/lite');
const client = algoliasearch(algolia.APP_ID, algolia.API_KEY);
const index = client.initIndex(algolia.index_name);

function addIndex(user) {
    index.addObject({
        objectID: user._id,
        userName: user.userName
    });
}

function updateIndex(user) {
    return new Promise((res, reject) => {
        index.partialUpdateObject({
            objectID: user._id,
            userName: user.userName
        }, true, (error, content) => {
            if (error) reject(error);
            res(content);
        });
    });
}

module.exports = {
    addIndex,
    updateIndex,
}