// implement your API here
//console.log("index.js ran");//can test index.js connectivity to current terminal

//import express from 'express'; // ES Modules - node js does not support this

const express = require("express"); //CommonJS Modules (import/Export in Node.js)

const server = express() //creates our server

server.get('/', (req, res)=> {
    //access to 2 things, request object, response object
res.send({api: "up and running..."})

} ) //handle get requests (but which url?, what code do you want to run when they request to the url)

const port = 4000;

server.listen(port, () => {
    console.log(`\n ** API running on port ${port} **\n`)
})