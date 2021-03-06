// import your node modules

const db = require('./data/db.js');

// add your server code starting here
const express = require('express');
const server = express();
const PORT = 5000;
server.use(express.json());

// add endpoints
server.get('/api/posts', (req, res) => {
    db.find()
        .then(posts => {
            res.json(posts);
        })
        .catch(() => {
            res.status(500).json({ error: "The posts information could not be retrieved." });
        });
});

 server.post('/api/posts', (req, res) => {
    const post = req.body;
    if(post) {
        db.insert(post)
            .then(id => {
                db.findById(id)
                    .then(post => {
                        res.json(post);
                    });
            })
            .catch(() => {
                res.status(500).json({ error: "There was an error while saving the post to the database" });
            });
    } else {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
});

 server.get('/api/post/:id', (req, res) => {
    const id = req.params.id;
     db.findById(id)
        .then(post => {
            if (post[0]) {
                res.json(post);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            }
        })
        .catch(() => {
            res.status(500).json({ error: "The post information could not be retrieved." });
        });
});

server.delete('/api/posts/:id', (req, res) => {
    const id = req.params.id;
     db.findById(id)
        .then(post => {
            if (post[0]) {
                db.remove(id)
                    .then(count => {
                        res.json({ message: "The post was deleted succesfully" })
                    })
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            }
        })
        .catch(() => {
            res.status(500).json({ message: "The post with the specified ID does not exist." });
        });
});

server.put('/api/post/:id', (req, res) => {
    const post = req.body;
    const id = req.params.id;
     if (post) {
        db.findById(id)
        .then(post => {
            if (post[0]) {
                db.insert(id, post)
                    .then(count => {
                        if (count) {
                            db.findById(id)
                                .then(post => {
                                    res.json(post);
                                })
                        } else {
                            res.status(500).json({ error: "The post information could not be modified." })
                        }
                 });
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            }
        })
        .catch(() => {
            res.status(500).json({ message: "The post with the specified ID does not exist." });
        });
    } else {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
    
});
// listening
server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});