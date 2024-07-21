const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/')
.then(()=>console.log("Connected to MongoDB ... "))
.catch(err=>console.error('Error Caught | Could not connect to MongoDB'));


const SignUpSchema = new mongoose.Schema({
    Phone_Number:Number,
    Email:String,
    Name:String,
    User_Registration_Date:{type:Date,default:Date.now},
    DateOfBirth:{type:Date,default:Date.now},
    Salary:Number
});



//Second argument -->> The name of the Schema
const Course = mongoose.model('Course',SignUpSchema)
//First letter is capital-->> Therefore not an object

//Pascal for classses

async function CreateCourse(){
    const course = new Course({
    Phone_Number:123456,
    Email:"123@",
    Name:"Mrin",
    Salary:123456
});

const result = await course.save();
console.log(result);

}




CreateCourse();

//Classes and Objects
//Course and Instances of that class

//Course , nodeCourse

//The testings
