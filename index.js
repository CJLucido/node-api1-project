// implement your API here
//console.log("index.js ran");//can test index.js connectivity to current terminal

const db = require('./data/db.js') // <<<1 import the database file

//import express from 'express'; // ES Modules - node js does not support this

const express = require("express"); //CommonJS Modules (import/Export in Node.js)

const server = express() //creates our server

server.use(express.json())

server.use(cors())

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
    let nameBio = req.body
    if((nameBio.hasOwnProperty('name') && nameBio.hasOwnProperty('bio')) && (nameBio.bio !== null)){ //the third condition is because the function itself will accept bio as null
      nameBio = req.body
 

    db.insert(nameBio)//without a req name the insert function will just fail and go to catch
    .then(dbentry => {
        // if(nameBio !== null){
           
               
            res.status(201).json(dbentry)
                
            
        // }else{
            
          //if there is no name it wont even reach here, it will go straight to the catch   //in the migration we can see that the name is not nullable but the bio is!
        //   res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
        // }
        
    })
    .catch(err=>{
        console.log("error on POST /db", err)
        res.status(500).json({error:  "There was an error while saving the user to the database" }) 
    })
} else{
    res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
 }
})

//remove a user by id

server.delete(`/api/users/:id`, (req, res)=>{
    const id = req.params.id

    db.remove(id)
    .then(numOfRecords => {
        if(numOfRecords === 0){
            res.status(404).json({message: "The user with the specified ID does not exist."})
        }else{
            res.status(200).json({message: "user removed"})
        }
    })
    .catch(err => {
        console.log("error on DEL specific user", err)
        res.status(500).json({error: "The user could not be removed"})
    })
})

//update a user by id and the changes

server.put(`/api/users/:id`, (req, res) => {
    const id = req.params.id
    const newBio = req.body
    db.update(id, newBio)
    .then(numOfUpdatedRecords =>{
        if(numOfUpdatedRecords === 0){
            res.status(404).json({message: "The user with the specified ID does not exist."})
        }
        else if (newBio.hasOwnProperty('name') && newBio.hasOwnProperty('bio')){
            res.status(200).json(req.body)
        }
        else{
            
            res.status(400).json({errorMessage: "Please provide name and bio for the user."})
        }
    })
    .catch(err => {
        console.log("error on PUT user", err)
        res.status(500).json({error: "The user information could not be modified." })
    })
})

const port = 4000;

server.listen(port, () => {
    console.log(`\n ** API running on port ${port} **\n`)
})