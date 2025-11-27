const { body, query } = require('express-validator');

exports.registerValidator = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('age')
    .notEmpty()
    .withMessage('Age range is required')
    .isIn(['18-25', '26-35', '36-45', '46-55', '56-65', '65+'])
    .withMessage('Invalid age range'),
  
  body('location')
    .notEmpty()
    .withMessage('Location is required')
];

exports.checkInValidator = [
  body('mood')
    .isInt({ min: 1, max: 10 })
    .withMessage('Mood must be between 1 and 10'),
  
  body('activities')
    .optional()
    .isArray()
    .withMessage('Activities must be an array'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
];

exports.appointmentValidator = [
  body('provider')
    .notEmpty()
    .withMessage('Provider is required')
    .isMongoId()
    .withMessage('Invalid provider ID'),
  
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('time')
    .notEmpty()
    .withMessage('Time is required'),
  
  body('type')
    .notEmpty()
    .withMessage('Appointment type is required')
    .isIn(['counseling', 'therapy', 'consultation', 'followup'])
    .withMessage('Invalid appointment type')
];
