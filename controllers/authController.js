const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const mail = require('../handlers/mail');

exports.login = passport.authenticate('local',{
    failureRedirect:'/login',
    failureFlash: 'Failed login!',
    successRedirect: '/',
    successFlash: 'You are now logged in'
});

exports.logout = (req,res) => {
    req.logout();
    req.flash('success','You are now logged out!');
    res.redirect('/');
};

exports.isLoggedIn = (req,res,next) => {
    // first check if the user is authenticated
    if (req.isAuthenticated()) {
        next();
        return;
    } else {
        req.flash('error', 'Must be logged in to do that!');
        res.redirect('/login');
    }
};

exports.forgot = async (req,res) => {
    // 1. see if a user with that email exists
    const user = await User.findOne({email:req.body.email});
    if (!user) {
        // for security reasons, default to password
        req.flash('success', "You have been emailed a password reset link.");
        return res.redirect('/login');
    }
    // 2. set reset tokens and expiry on their account
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from no
    await user.save();
    // 3. send them an email with the token
    const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
    await mail.send({
        user,
        subject:'Passsword Reset',
        resetURL,
        filename:'password-reset'
    });
    req.flash('success', `You have been emailed a password reset link.`);
    res.redirect('/login');

    // 4. redirect to log in after email token has been sent

};

exports.reset= async (req,res) => {
    const user = await User.findOne({
        resetPasswordToken:req.params.token,
        resetPasswordExpires: { $gt: Date.now()  }    
    });
    if (!user) {
        req.flash('error', 'Password reset is invalid or has expired. Please try again.');
        return res.redirect('/login');
    }
    // if there is a user show reset password form.
    res.render('reset', {title: 'Reset Password'});
};

exports.confirmedPasswords = (req,res,next) => {
    if (req.body.password == req.body['password-confirm'])
    {
        next();
        return;
    }
    else {
        req.flash('error', 'Passwords do not match')
    }
};

exports.update = async (req,res) => {
    const user = await User.findOne({
        resetPasswordToken:req.params.token,
        resetPasswordExpires: { $gt: Date.now()  }    
    });
    if (!user) {
        req.flash('error', 'Password reset is invalid or has expired. Please try again.');
        return res.redirect('/login');
    };
    const setPassword = promisify(user.setPassword,user);
    await setPassword(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    const updatedUser = await user.save(); // actually does the saving
    await req.login(updatedUser);
    req.flash('success', 'Your password has been reset!');
    res.redirect('/');
};


