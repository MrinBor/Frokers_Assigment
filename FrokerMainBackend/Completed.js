const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
const app = express();

require("dotenv").config()
console.log(process.env.port)

app.use(express.json()); // Middleware to parse JSON bodies

// Connect to MongoDB
mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB ... "))
    .catch(err => console.error('Error Caught | Could not connect to MongoDB'));

// Mongoose Schema
const userSchema = new mongoose.Schema({
    Phone_Number: { type: Number, required: true },
    Email: { type: String, required: true },
    Name: { type: String, required: true },
    User_Registration_Date: { type: Date, default: Date.now },
    DateOfBirth: { type: Date, required: true },
    Salary: { type: Number, required: true }
});

const User = mongoose.model('User', userSchema);

// Joi Validation Schema
const joiSchema = Joi.object({
    Phone_Number: Joi.number().required(),
    Email: Joi.string().email().required(),
    Name: Joi.string().min(3).required(),
    DateOfBirth: Joi.date().required().custom((value, helpers) => {
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        if (age < 20) {
            return helpers.message('User should be above 20 years of age');
        }
        return value;
    }),
    Salary: Joi.number().min(25000).required().messages({
        'number.min': 'Monthly salary should be 25k or more'
    })
});

// Signup route
app.post('/signup', async (req, res) => {
    // Validate request body against Joi schema
    const { error } = joiSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Create and save user if validation passes
    let user = new User({
        Phone_Number: req.body.Phone_Number,
        Email: req.body.Email,
        Name: req.body.Name,
        DateOfBirth: req.body.DateOfBirth,
        Salary: req.body.Salary
    });

    user = await user.save();
    res.send(user);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
