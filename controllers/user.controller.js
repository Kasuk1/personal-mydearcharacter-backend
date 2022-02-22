const { request, response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const { generateJWT } = require('../helpers/jwt');

// Register User
const registerUser = async (req = request, res = response) => {
  try {
    const { email, password } = req.body;

    // Verify that the email does not already exist
    const existEmail = await User.findOne({ email });

    if (existEmail) {
      return res.status(400).json({
        ok: false,
        msg: 'The email already exists',
      });
    }

    // Creating user model
    const user = new User(req.body);

    // Encrypting password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // Save user in DB
    await user.save();

    // Generate JWT
    const token = await generateJWT(user.id);

    res.json({
      ok: true,
      user,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: 'Report to the admin',
    });
  }
};

// Login user
const loginUser = async (req = request, res = response) => {
  try {
    const { email, password } = req.body;

    // Verify if email exists
    const userDB = await User.findOne({ email });
    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Email or password incorrect',
      });
    }

    // Validate password
    const validPassword = bcrypt.compareSync(password, userDB.password);
    if (!validPassword) {
      return res.status(404).json({
        ok: false,
        msg: 'Email or password incorrect',
      });
    }

    // Generate JWT
    const token = await generateJWT(userDB.id);

    res.json({
      ok: true,
      user: userDB,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: 'Report to the admin',
    });
  }
};

// List users
const listUsers = async (req = request, res = response) => {
  try {
    const users = await User.find();

    res.json({
      ok: true,
      users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: 'Report to the admin',
    });
  }
};

// Renew Token
const renewToken = async (req = request, res = response) => {
  // Extracting uid sent by the req through validate-jwt middleware
  // when all is successful
  const uid = req.uid;

  // Generate new JWT
  const token = await generateJWT(uid);

  // Obtain the user by uid
  const user = await User.findById(uid);

  res.json({
    ok: true,
    user,
    token,
  });
};

module.exports = {
  registerUser,
  loginUser,
  listUsers,
  renewToken,
};
