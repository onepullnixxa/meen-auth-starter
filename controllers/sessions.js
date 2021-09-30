// Dependencies
const express = require('express');
const bcrypt = require('bcrypt');
const sessionsRouter = express.Router();
const User = require('../models/user.js');

// New (login page)

// Delete (logout route)
sessionsRouter.delete('/', (req, res) => {
    req.session.destroy((error) => {
        res.redirect('/');
    });
})

// Create (login route)
sessionsRouter.post('/', (req, res) => {
    User.findOne({
        email: req.body.email
    }, (error, foundUser) => {
        if(!foundUser){
            res.send("Oops! No user with that email address has been registered.")
        } else {
            // If a user has been found
            // compare the given password with the hashed password we have stored
            const passwordMatches = bcrypt.compareSync(req.body.password, foundUser.password);

            // if the passwords match
            if (passwordMatches) {
                // add the user to our session
                req.session.currentUser = foundUser;

                // redirect back to our home page
                res.redirect('/');
            } else {
                // if the passwords don't match
                res.send("Oops! Invalid credentials.");
            }
        }
    });
});

// Export Sessions Router
module.exports = sessionsRouter;


// Users Create action --> Register a new user
// Sessions Create action ---> Creates cookie, logs a user in
// Sessions DESTROY (DELETE) action ---> Logs a user out. Deletes the cookie