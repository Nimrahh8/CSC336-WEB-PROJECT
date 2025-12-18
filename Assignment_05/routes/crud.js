const express = require('express');
const router = express.Router();

// In-memory storage (replace with database in production)
let posts = [];

// CRUD page route
router.get('/', (req, res) => {
    res.render('crud', { title: 'CRUD App - Disco Club', posts: posts });
});

// API Routes for CRUD operations

// Get all posts
router.get('/api/posts', (req, res) => {
    res.json(posts);
});

// Get single post
router.get('/api/posts/:id', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (post) {
        res.json(post);
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
});

// Create post
router.post('/api/posts', (req, res) => {
    const newPost = {
        id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
        title: req.body.title,
        body: req.body.body,
        userId: 1,
        createdAt: new Date()
    };
    posts.push(newPost);
    res.status(201).json(newPost);
});

// Update post
router.put('/api/posts/:id', (req, res) => {
    const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (postIndex !== -1) {
        posts[postIndex] = {
            ...posts[postIndex],
            title: req.body.title,
            body: req.body.body,
            updatedAt: new Date()
        };
        res.json(posts[postIndex]);
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
});

// Delete post
router.delete('/api/posts/:id', (req, res) => {
    const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (postIndex !== -1) {
        const deletedPost = posts.splice(postIndex, 1);
        res.json({ message: 'Post deleted', post: deletedPost[0] });
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
});

module.exports = router;
