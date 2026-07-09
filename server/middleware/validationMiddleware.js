import {body, validationResult} from "express-validator";

export const validateProfile = [
  body("full_name")
    .trim()
    .notEmpty()
    .withMessage("Full Name is Required"),

  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number"),

  body("bio")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),

  body("github_url")
    .optional()
    .isURL()
    .withMessage("Invalid GitHub URL"),

  body("linkedin_url")
    .optional()
    .isURL()
    .withMessage("Invalid LinkedIn URL"),

  body("portfolio_url")
    .optional()
    .isURL()
    .withMessage("Invalid Portfolio URL"),

    (req, res, next)=> {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    next();
  },

];
