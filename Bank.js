const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Joi = require('joi');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/userManagement', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Define User schema and model
const userSchema = new mongoose.Schema({
  purchasePower: { type: Number, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now },
  dob: { type: Date, required: true },
  monthlySalary: { type: Number, required: true }
});

const User = mongoose.model('User', userSchema);

// Show user data endpoint
app.get('/user', async (req, res) => {
  try {
    // Fetch all users from the database and select specified fields
    const users = await User.find().select('purchasePower phoneNumber email registrationDate dob monthlySalary');
    res.send(users);
  } catch (err) {
    // Handle errors if any
    res.status(500).send(err.message);
  }
});

// Borrow money endpoint
app.post('/borrow', async (req, res) => {
  // Define validation schema for request body
  const schema = Joi.object({
    userId: Joi.string().required(), // User ID must be provided and be a string
    amount: Joi.number().min(0).required() // Amount must be provided and be a non-negative number
  });

  // Validate request body against schema
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { userId, amount } = req.body;

  try {
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    // Update purchase power
    user.purchasePower += amount;

    // Calculate monthly repayment amount with an interest rate of 8% for a 1-year period
    const interestRate = 0.08;
    const monthlyRepayment = (amount + (amount * interestRate)) / 12;

    // Save updated user information
    await user.save();

    // Send response with updated purchase power and monthly repayment amount
    res.send({
      purchasePower: user.purchasePower,
      monthlyRepayment: monthlyRepayment.toFixed(2) // Format to 2 decimal places
    });
  } catch (err) {
    // Handle errors if any
    res.status(500).send(err.message);
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
