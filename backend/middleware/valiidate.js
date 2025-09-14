const { check } = require("express-validator");

exports.registerValidator = [
    check("username", "Username is required").not().isEmpty(),
    check("password", "password is required").not().isEmpty().trim(),
    check("email", "email is required").isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
    check("role", "Role is required").not().isEmpty()
]

module.exports.validateLogin = [
  check("username", "username is required").not().isEmpty(),
  check("password", "password is required").not().isEmpty().trim()

];
