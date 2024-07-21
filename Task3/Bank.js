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
  const users = await User.find().select('purchasePower phoneNumber email registrationDate dob monthlySalary');
  res.send(users);
});

// Borrow money endpoint
app.post('/borrow', async (req, res) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    amount: Joi.number().min(0).required()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { userId, amount } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).send('User not found');

  user.purchasePower += amount;

  const interestRate = 0.08;
  const monthlyRepayment = (amount + (amount * interestRate)) / 12; // Assuming a 1-year repayment period
  await user.save();

  res.send({
    purchasePower: user.purchasePower,
    monthlyRepayment: monthlyRepayment.toFixed(2)
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
