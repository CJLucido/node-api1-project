// implement your API here
//console.log("index.js ran");//can test index.js connectivity to current terminal

const db = require('./data/db.js') // <<<1 import the database file

//import express from 'express'; // ES Modules - node js does not support this

const express = require("express"); //CommonJS Modules (import/Export in Node.js)

const server = express() //creates our server

server.use(express.json())

server.get('/', (req, res)=> {
    //access to 2 things, request object, response object
res.send({api: "up and running..."})

} ) //handle get requests (but which url?, what code do you want to run when they request to the url)

//list from db GET /db

server.get('/api/users', (req, res) => {
    db.find()
    .then(dbentries => {
        res.status(200).json(dbentries)
    })
    .catch(err=>{
        console.log("error on GET /db", err)
        res.status(500).json({ error: "The users information could not be retrieved."}) 
    })
})


//GET individual
server.get('/api/users/:id', (req, res) => {
    const id = req.params.id


    db.findById(id)
    .then(entry => {

        if(!entry){
            res.status(404).json({message: "The user with the specified ID does not exist."})
        } else{
            res.status(201).json(entry)
        }
        
    })
    .catch(err=>{
        console.log("error on GET /db/:id", err)
        res.status(500).json({error: "The user information could not be retrieved." }) 
    })
})

//POST individual
server.post('/api/users', (req, res) => {
    const nameBio = req.body
    const nameIf = req.body.name
    const bioIf = req.body.bio
console.log(nameBio)
    db.insert(nameBio)
    .then(dbentry => {
        if(dbentry.bio == null || dbentry.name == null){
             //if there is no name it wont even reach here, it will go straight to the catch   
            res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
               
            
                
            
        }else{
            res.status(201).json(dbentry)
        
        }
        
    })
    .catch(err=>{
        console.log("error on POST /db", err)
        res.status(500).json({error:  "There was an error while saving the user to the database" }) 
    })
})

//remove a hub by id

//update a hub by id and the changes


const port = 4000;

server.listen(port, () => {
    console.log(`\n ** API running on port ${port} **\n`)
})