const Posts = require('./db.js')
// starting at /api/posts
// the requests url concatentate to the end of /api/posts
const router = require('express').Router()

// router.get('/', (req, res) => {
//     console.log('query string', req.query)
//     Pos
//     res.status(200).json(req.query)
// })

router.post('/api/posts', (req, res) => {

    const properties = Object.keys(req.body)
    if(!properties.includes('title') || !properties.includes('contents')) {
        // (Bad Request)
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
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
    }
    
})
router.post('/api/posts/:id/comments', (req, res) => {
    const id = req.params.id
    const properties = Object.keys(req.body)
    if(!properties.includes('text')) {
        // (Bad Request)
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    } else {
        Posts.findById(id)
        .then(post => {
            // console.log(comment)
            Posts.insertComment(req.body)
                .then(comment => {
                    // (Created)
                    res.status(201).json(comment)
                })
                .catch(err => {
                        // (Server Error)
                    res.status(500).json({ error: "There was an error while saving the comment to the database" })
                })
        })
        .catch(err => {
            // (Not Found)
            res.status(404).json({ message: "The post with the specified ID does not exist." })

        })
    }
    
})
router.get('/api/posts', (req, res) => {
    Posts.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            // (Server Error)
            res.status(500).json({ error: "The posts information could not be retrieved." })
        })
})

router.get('/api/posts/:id', (req, res) => {
    const id = req.params.id
    Posts.findById(id)
        .then(post => {
            if(!post) {
                // (Not Found)
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
                // success
                res.status(200).json(post)
            }
        })
        .catch(err => {
            // (Server Error)
            res.status(500).json({ error: "The post information could not be retrieved." })
        })
})


router.get('/api/posts/:id/comments', (req, res) => {
    const id = req.params.id
    Posts.findCommentById(id)
        .then(comment => {
            if(!comment) {
                // (Not Found)
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
                // success
                res.status(200).json(comment)
            }
        })
        .catch(err => {
            // (Server Error)
            res.status(500).json({ error: "The comments information could not be retrieved." })
        })
})

// all above this line work

router.delete('/api/posts/:id', (req, res) => {
    const id = req.params.id
    Posts.remove(id)
        .then(deletedPost => {
            // console.log(deletedPost)
            if(!deletedPost) {
                // (Not Found)
                res.status(404).json({ message: "The post with the specified ID does not exist." })

            } else {
                // success
                res.status(200).json(deletedPost)
            }
        })
        .catch(err => {
             // (Server Error)
            res.status(500).json({ error: "The post could not be removed" })
        })
})

router.put('/api/posts/:id', (req, res) => {
    const id = req.params.id
    const {title, contents} = req.body
    if(!title || !contents) {
        // (Bad Request)
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        Posts.findById(id)
        .then(post => {
            Posts.update(id, req.body)
                .then(updatedPost => {
                    // is there an error here?
                    if(!updatedPost) {
                        res.status(500).json({ error: "The update totally failed."})
                    } else {
                        // success
                        res.status(200).json(updatedPost)
                    }
                })
                .catch(err => {
                     // (Server Error)
                    res.status(500).json({ error: "The post information could not be modified." })
                })
        })
        .catch(err => {
            // (Not Found)
            res.status(404).json({ message: "The post with the specified ID does not exist." })

        })
    }
    
})
module.exports = router