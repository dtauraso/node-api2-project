const Posts = require('./db.js')

const router = require('express').Router()

router.get('/', (req, res) => {
    console.log('query string', req.query)
    res.status(200).json(req.query)
})

router.post('/api/posts', (req, res) => {

    const {title, contents} = Object.keys(req.body)
    if(!title || !contents) {
        // (Bad Request)
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
    const newPost = req.body
    Posts.insert(newPost)
        .then(post => {
            // (Created)
            res.status(201).json(post)
        })
        .catch(err => {
            // (Server Error)
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        })
})

module.exports = router