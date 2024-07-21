const express = require('express');
const app = express();
//returns an Object Stored in app variable
// Functionalitites Available get post put delete








// ############################################################
const courses = [
    {id:1, name:"Course No 1 Is Showing "},
    {id:2 , name:"Course No 2 Is Showing "},
    {id:3 , name:"Course No 3 Is Showing "},
    {id:4 , name:"Course No 4 Is Showing "},
]



//Say courses replicate Data from the EXTERNAL API LIST 
//AFTER FETCHING IT IS BEING SHOW
app.get('/api/courses/find/:id',(req,res)=>{
    var CourseFind = courses.find(c => c.id == parseInt(req.params.id));//String too  bool
    if(!CourseFind)
    {
        res.status(404).send("The course with Given ID was not found");
    }
    res.send(courses)
})


//let reset late
//const To define a constant


app.get('/',(req,res)=>{
    res.send("Hello There");
});

  

app.get('/api/courses',(req,res)=>{
    res.send([1,2,3,4,5]);
    //Returning array of numbers
});



//Routes with specific parameters to fetch specific data
// id or the course_id
app.get('/api/courses/:id',(req,res)=>{
    res.send(`The id fetched is ==-->> ${req.params.id}`);

    //We will have the Following
    //Sending the specific parameter to the Client
    // res.send("Particular Course Details FETCHING ");
});




//With two parameters we will have the Following
app.get('/api/posts/:year/:month',(req,res)=>{
    res.send(`Month is ${req.params.month} , Year is ${req.params.year}`);
})



//The query string parameters
// A new End Point
app.get('/api/courses/:id',(req,res)=>{
    res.send([1,2,3]);
})




//Dyanamic port assignment
const port = process.env.PORT || 3000;




//The arrow function syntax
//Listening on the Port No 30000
app.listen(port,()=>{
    console.log(`Listening on the Port No ${port} ...`);
})









// /api/courses/1
/*** The route parmeters */



//Port is dyanamixally assigned in the hosting environment
/**
 * In hosting environment we have ports
 * They are port of the Process Run Environment
 * 
 * 
 */

//Beter way of automatic running when changes are made is by the use of 
// npm i -g nodemon
/**
 * [nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node RestApi.js`
Listening On the Port No 3000
[nodemon] restarting due to changes...
[nodemon] starting `node RestApi.js`
Listening On the Port No 3000
[nodemon] restarting due to changes...
[nodemon] starting `node RestApi.js`
Listening On the Port No 3000

 */