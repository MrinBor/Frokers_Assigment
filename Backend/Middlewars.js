const express = require('express');
const Joi = require('joi');
const app = express();
const port = 3000;
const logger = require('./logger')



app.use(express.json()); // Middleware to parse JSON bodies
//Populate req.body property

app.use(function(req,res,next){
    console.log("Authenticating ... ");
    next();
})

app.use(logger);

// Mock data
const courses = [
    { id: 1, name: "Course No 1 Is Showing" },
    { id: 2, name: "Course No 2 Is Showing" },
    { id: 3, name: "Course No 3 Is Showing" },
    { id: 4, name: "Course No 4 Is Showing" },
];


// Validation schema
const schema = Joi.object({
    name: Joi.string().min(3).required()
});

// Create a new course
app.post('/api/courses', (req, res) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name,
    };
    courses.push(course);
    res.send(course);
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//Req processing pipeline
//One or more middle ware functions
//Returning functions 
//We will have the following








//req res cycle
/**
 * Express . json
 */