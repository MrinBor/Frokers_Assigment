const mongoose = require('mongoose');
const express = require('express');
const router  = express.router();



mongoose.connect('mongodb://localhost/playground').then(()=>
console.log("Connected to MongoDB ... "));





//Real App<-- connection string comes from config file

//DBMS System
//Installation npm i mongoose
//We will have the follwing
