// implement your posts router here
const express = require('express')

const Posts = require('./posts-model')

const router = express.Router()

router.get('', async (req, res) =>{
    try{
        const postArr = await Posts.find();
        console.log(postArr)
        res.json(postArr)
    }catch(err){
        res.status(500).json({ message: "The posts information could not be retrieved" })
    }
})

router.get('/:id', async (req, res) =>{
    try{
        const { id } = req.params;
        const postById = await Posts.findById(id)
        console.log(postById)
        if(postById)
            res.json(postById)
        else 
            res.status(404).json({ message: "The post with the specified ID does not exist" })
    }catch(err){
        res.status(500).json({ message: "The post with the specified ID does not exist" })
    }
})

router.post('/', async (req, res) =>{
    try{
        console.log('post ran')
        res.json(req)
    }catch(err){
        res.status(500).json({ message: "The post with the specified ID does not exist" })
    }
})

router.get('/:id/comments', async (req,res) =>{
    try{
        const { id } = req.params;
        const postComments = await Posts.findPostComments(id)
        
        if (postComments.length>0){
            res.json(postComments)
        }
        else{
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
    }catch(err){
        res.status(500).json({ message: "The comments information could not be retrieved" })
    }
})


module.exports = router;