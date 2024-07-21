const mongoose = require('mongoose');
const express = require('express');
const Joi = require('joi');



mongoose.connect('mongodb://localhost/playground')
.then(()=>console.log("Connected to MongoDB ... "))
.catch(err=>console.error('Error Caught | Could not connect to MongoDB'));


const SignUpSchema = new mongoose.Schema({
    Phone_Number:Number,
    Email:String,
    Name:String,
    User_Registration_Date:{type:Date,default:Date.now},
    DateOfBirth:{type:Date},
    Salary:Number
});


const schema = Joi.object({
    name: Joi.string().min(3).required()
});
/**
 * ● User should be above 20 years of age.
● Monthly salary should be 25k or more.
 */




//Schema of documents We will have the follwing
//Schema Designing as per the Question:--
//We will have the Following

//Real App<-- connection string comes from config file

//DBMS System
//Installation npm i mongoose
//We will have the follwing
