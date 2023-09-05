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

router.post('/',  (req, res) =>{
    const { title, contents } = req.body
    if (!title || !contents){
        res.status(400).json({
            message:'Please provide title and contents for the post'
        })
    }else {
        Posts.insert({ title, contents})
            .then( async stuff =>{
                const postById = await Posts.findById(stuff.id)
                console.log(postById)
                res.status(201).json(postById)
            })
            .catch(err =>{
                res.status(500).json({
                    message:'There was an error while saving the post to the database',
                    err: err.message,
                    stack:err.stack,
                })
            })
    }
})

router.put('/:id', async (req, res) =>{
    const { id } = req.params;
    const { title, contents } = req.body
    const validId = await Posts.findById(id)
    if(!validId){
        res.status(404).json({ message: "The post with the specified ID does not exist" })
    }else if (!title|| !contents){
        res.status(400).json({ message: "Please provide title and contents for the post" })
    }else{
    Posts.update(id, {title,contents})
        .then(async () =>{
            const updatedItem = await Posts.findById(id)
            res.json(updatedItem)
        })
        .catch(err =>{
            res.status(500).json({
                message:'The post information could not be modified',
                err:err.message,
                stack:err.stack
            })
        })
    }

})

router.delete('/:id', async (req, res)=>{
    try{
        const { id } = req.params
        const deletedId = await Posts.findById(id)
        if(deletedId){
            Posts.remove(id)
            .then( () =>{
               res.json(deletedId) 
            })

            
        }else{
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }

    }catch{
        res.status(500).json({ message: "The post could not be removed" })
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