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

function updateIndex(user, callback) {
    index.partialUpdateObject({
        objectID: user._id,
        userName: user.userName
    }, true, (error, content) => {
        callback(error, content);
    });
}

module.exports = {
    addIndex,
    updateIndex,
}