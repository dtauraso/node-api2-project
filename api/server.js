const express = require('express')

const postsRouter = require('../posts/posts-router.js')


const server = express()

server.use(express.json())

server.get('/', (req, res) => {
    res.send(`
    <h2>Lambda Hubs API</h>
    <p>Welcome to the Lambda Hubs API</p>
    `)
})

// requests to routes that begin with /api/posts
// needs to be distinct between this set of routes and another router
server.use('/root', postsRouter)
module.exports = server