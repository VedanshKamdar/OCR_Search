const express = require('express');
const { signup, signin, profile } = require('../controllers/auth.controller');
const { validateSignup, validateSignin, validate} = require('../validators/auth.validator')
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/signup', validateSignup, validate, signup);
router.post('/signin', validateSignin, signin);
router.get('/profile', authMiddleware, profile);

module.exports = router;
