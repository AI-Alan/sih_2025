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

// Counsellor create validator (admin-managed)
export const counsellorCreateValidator = [
  check("firstName", "First name is required").not().isEmpty().trim(),
  check("lastName", "Last name is required").not().isEmpty().trim(),
  check("contactNo", "Contact number is required").isNumeric(),
  check("email", "Valid email is required").isEmail().normalizeEmail({ gmail_remove_dots: true }),
  check("password", "Password is required").not().isEmpty().trim(),
  check("qualifications", "Qualifications are required").not().isEmpty().trim(),
  check("availability", "Availability is required").not().isEmpty().trim(),
];

// Counsellor update validator (partial allowed)
export const counsellorUpdateValidator = [
  check("email").optional().isEmail().withMessage("Email must be valid").normalizeEmail({ gmail_remove_dots: true }),
  check("contactNo").optional().isNumeric().withMessage("Contact number must be numeric"),
];

// export default validateNewPassword = [
  
// ]
