const express = require('express');
const { createUser, loginUser, forgetpassword, checkUser, sendotpAPI, createAdmin } = require('../controllers/auth');
const passport = require('passport');
const { sendOTP } = require('../service/common');


const router =express.Router();

router.post('/singup',createUser)
.post('/login', passport.authenticate('local'),loginUser)
.post('/check', passport.authenticate('jwt') ,checkUser)
.post('/update-password',forgetpassword)
.post('/admin', createAdmin),

exports.router =router