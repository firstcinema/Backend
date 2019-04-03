const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

// GET Posts

router.get('/', async (req, res) => {
    const posts = await loadPosts();
    res.send(await posts.find({}).toArray());
});

// PUT Posts
router.post('/', async (req, res) => {
    const posts = await loadPosts();
    await posts.insertOne({
        text: req.body.text,
        createdAt: new Date()
    });
    res.status(201).send();
});

// DELETE posts

router.delete('/:id', async (req, res) => {
    const posts = await loadPosts();
    await posts.deleteOne({
        _id: new mongodb.ObjectID(req.params.id)
    });
    res.status(200).send();
});

async function loadPosts() {
    const client = await mongodb.MongoClient.connect
    ('mongodb://main:main123@ds253094.mlab.com:53094/first_cinema', {
        useNewUrlParser: true
    });

    return client.db('first_cinema').collection('posts');
}

module.exports = router;