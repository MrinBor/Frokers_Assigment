const express = require('express'); // Importing Express framework
const mongoose = require('mongoose'); // Importing Mongoose for MongoDB interaction
const Joi = require('joi'); // Importing Joi for data validation
const morgan = require('morgan'); // Importing Morgan for logging HTTP requests
const helmet = require('helmet'); // Importing Helmet for securing HTTP headers
const app = express(); // Creating an Express application

require("dotenv").config(); // Load environment variables from .env file
let port = process.env.PORT || 3000; // Set default port if not provided in .env
console.log(port);

app.use(express.json()); // Middleware to parse JSON bodies

// Use Morgan middleware for logging requests in 'dev' format
app.use(morgan('dev'));

// Use Helmet middleware for securing HTTP headers
app.use(helmet()); 

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://localhost:27017/Frokers_Database', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB ... "))
    .catch(err => console.error('Error Caught | Could not connect to MongoDB'));

// Define a Mongoose Schema for user signup
const signUpSchema = new mongoose.Schema({
    Phone_Number: { type: Number, required: true }, // User's phone number, required
    Email: { type: String, required: true }, // User's email, required
    Name: { type: String, required: true }, // User's name, required
    User_Registration_Date: { type: Date, default: Date.now }, // Registration date, default to current date
    DateOfBirth: { type: Date, required: true }, // User's date of birth, required
    Salary: { type: Number, required: true }, // User's monthly salary, required
    Status: { type: String, default: "Pending" } // Application status, default to "Pending"
});

// Create a Mongoose model based on the schema
const User = mongoose.model('User', signUpSchema);

// Define a Joi validation schema for user signup
const joiSchema = Joi.object({
    Phone_Number: Joi.number().required(), // Phone number must be a number and required
    Email: Joi.string().email().required(), // Email must be a valid email format and required
    Name: Joi.string().min(3).required(), // Name must be a string with at least 3 characters and required
    DateOfBirth: Joi.date().required().custom((value, helpers) => {
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        if (age < 20) {
            return helpers.message('User should be above 20 years of age');
        }
        return value;
    }), // Date of birth must be a date and user must be above 20 years old
    Salary: Joi.number().min(25000).required().messages({
        'number.min': 'Monthly salary should be 25k or more'
    }) // Salary must be a number with minimum value of 25,000 and required
});

// Define the signup route
app.post('/signup', async (req, res) => {
    // Validate request body against Joi schema
    const { error } = joiSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message); // Return validation error if any

    // Approve or reject based on age and salary
    const age = new Date().getFullYear() - new Date(req.body.DateOfBirth).getFullYear();
    const status = age >= 20 && req.body.Salary >= 25000 ? "Approved" : "Rejected";

    // Create and save user if validation passes
    let user = new User({
        Phone_Number: req.body.Phone_Number,
        Email: req.body.Email,
        Name: req.body.Name,
        DateOfBirth: req.body.DateOfBirth,
        Salary: req.body.Salary,
        Status: status // Set status based on validation criteria
    });

    try {
        user = await user.save(); // Save the user to the database
        res.send(user); // Send the saved user as a response
    } catch (err) {
        res.status(500).send('An error occurred while saving the user.'); // Handle errors during saving
    }
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
