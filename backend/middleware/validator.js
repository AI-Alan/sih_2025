import { check } from 'express-validator';

export const registerValidator = [
  check("firstName", "First name is required").not().isEmpty().trim(),
  check("lastName", "Last name is required").not().isEmpty().trim(),
  check("university", "University is required").not().isEmpty().trim(),
  check("program", "Program is required").not().isEmpty().trim(),
  check("email", "Valid email is required").isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),
 check("password", "password is required").not().isEmpty().trim(),
];

export const validateLogin = [
  check("email", "Valid email is required").isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),
  check("password", "password is required").not().isEmpty().trim()
];

// export default validateNewPassword = [
  
// ]
