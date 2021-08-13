const router = require('express').Router();
const User = require('../model/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./verifyToken');

//REGISTER
router.post(
  '/signup',
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
  async (req, res) => {
    //Check Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Destrucure
    const { name, email, password } = req.body;

    //Check email exist
    const emailExist = await User.findOne({ email: email });
    if (emailExist) {
      return res.status(400).send('Email already exist!');
    }

    //Hash Password
    const salt = await bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const user = new User({
      name: name,
      email: email,
      password: hash,
    });
    await user
      .save()
      .then(() => {
        res.status(201).send(user);
        console.log('User Registered');
      })
      .catch((e) => {
        res.status(400).send('User not Registerd!');
      });
  }
);

//LOGIN
router.post(
  '/login',
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
  async (req, res) => {
    //Check Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Destrucure
    const { email, password } = req.body;

    //Check email exist
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).send('Invalid Details');
    }

    //check pass
    const pass = await bcrypt.compare(password, user.password);
    if (!pass) return res.status(400).send('Wrong Password');

    //create token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN);
    res.header('auth-token', token).send(token);
  }
);

router.get('/home', auth, (req, res) => {
  res.send('Welcome to Home Page!');
});

module.exports = router;
