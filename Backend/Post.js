const express = require('express');
const Joi = require('joi');
const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

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

// Read all courses
app.get('/api/courses', (req, res) => {
    res.send(courses);
});

// Read a specific course
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('Course not found');
    res.send(course);
});

// Update a course
app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('Course not found');

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    course.name = req.body.name;
    res.send(course);
});

// Delete a course
app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('Course not found');

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
