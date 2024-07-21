const express = require('express'); // Importing Express framework
const mongoose = require('mongoose'); // Importing Mongoose for MongoDB interaction
const Joi = require('joi'); // Importing Joi for data validation
const morgan = require('morgan'); // Importing Morgan for logging HTTP requests
const helmet = require('helmet'); // Importing Helmet for securing HTTP headers
const jwt = require('jsonwebtoken'); // Importing JSON Web Token for authentication
const bcrypt = require('bcryptjs'); // Importing bcrypt for password hashing
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000; // Set default port if not provided in .env

// Middleware
app.use(express.json()); // Middleware to parse JSON bodies
app.use(morgan('dev')); // Use Morgan middleware for logging requests in 'dev' format
app.use(helmet()); // Use Helmet middleware for securing HTTP headers

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Frokers_Database', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB ... "))
    .catch(err => console.error('Error Caught | Could not connect to MongoDB'));

// Mongoose Schema for User
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, // User's email, must be unique
    password: { type: String, required: true } // User's hashed password
});

const User = mongoose.model('User', userSchema); // Create Mongoose model based on the schema

// Joi Validation Schema for Signup
const joiSchema = Joi.object({
    phoneNumber: Joi.number().required(), // Phone number must be a number and required
    email: Joi.string().email().required(), // Email must be a valid email format and required
    name: Joi.string().min(3).required(), // Name must be a string with at least 3 characters and required
    dateOfBirth: Joi.date().required().custom((value, helpers) => {
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        if (age < 20) {
            return helpers.message('User should be above 20 years of age');
        }
        return value;
    }), // Date of birth must be a date and user must be above 20 years old
    salary: Joi.number().min(25000).required().messages({
        'number.min': 'Monthly salary should be 25k or more'
    }), // Salary must be a number with a minimum value of 25,000 and required
    password: Joi.string().min(6).required() // Password must be at least 6 characters and required
});

// Signup route
app.post('/signup', async (req, res) => {
    // Validate request body against Joi schema
    const { error } = joiSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message); // Return validation error if any

    // Calculate age and determine status
    const age = new Date().getFullYear() - new Date(req.body.dateOfBirth).getFullYear();
    const status = age >= 20 && req.body.salary >= 25000 ? "Approved" : "Rejected";

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user document
    let user = new User({
        email: req.body.email,
        password: hashedPassword
    });

    try {
        user = await user.save(); // Save the user to the database
        res.send(user); // Send the saved user as a response
    } catch (err) {
        res.status(500).send('An error occurred while saving the user.'); // Handle errors during saving
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' }); // Return error if user not found
    }

    // Compare provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' }); // Return error if password does not match
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with token
    res.json(`Login Successful ${ token }`);
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

/**
 * Example Requests:
 * 
 * Signup:
 * POST http://localhost:3000/signup
 * {
 *   "phoneNumber": 1234567890,
 *   "email": "user@example.com",
 *   "name": "John Doe",
 *   "dateOfBirth": "2000-01-01",
 *   "salary": 30000,
 *   "password": "Str0ngP@ssw0rd!"
 * }
 * 
 * Login:
 * POST http://localhost:3000/login
 * {
 *   "email": "user@example.com",
 *   "password": "Str0ngP@ssw0rd!"
 * }
 */
