const { Console } = require('console');
const http = require('http');


const server = http.createServer((req,res)=>{
    if(req.url === '/')
    {
        res.write('Hello World');
        res.end();
        console.log('Hello qWorld');
    }

    if(req.url === '/api/courses')
    {
        res.write(JSON.stringify([1,2,3]));
        res.end();
    }
});

server.listen(3000,()=>{
    console.log("Listening on the PORT 3000")
})


//The client and the server <-- By sending the http requests

//REST <-->> Representational State Transfer
//CRUD <-- CREATE READ UPDATE DELETE OPERATIONS

// VIDLY APPLICATION

//HTTP METHODS <-- CRUD -->. CREATE READ UPDATE DELETE
/**
 * Put <-- Updating the customer request
 * 
 */