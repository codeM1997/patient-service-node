import e from "express";

export const patientSchema = {
  name: {
    notEmpty: {
      errorMessage: "Name is required",
    },
    isString: {
      errorMessage: "Name must be a string",
    },
  },
  dob: {
    notEmpty: {
      errorMessage: "Date of birth is required",
    },
    isDate: {
      options:{
        format: "YYYY-MM-DD",
        strictMode: true,
      },
      errorMessage: "Date of birth must be a valid date in YYYY-MM-DD format",
    },
  },
  gender: {
    notEmpty: {
      errorMessage: "Gender is required",
    },
    isString: {
      errorMessage: "Gender must be a string",
    },
    isIn: {
      options: ["male", "female", "other"],
      errorMessage: "Gender must be one of male, female or other",
    },
  },
  contactNo: {
    notEmpty: {
      message: "Contact number is required",
    },
    isNumeric: true,
    isMobilePhone: {
      errorMessage: "Contact number must be a valid Indian mobile number",
      options: ["en-IN"],
    },
  },
  emergencyContactNo: {
    notEmpty: {
      message: "Emergency contact number is required",
    },
    isNumeric: true,
    isMobilePhone: {
      errorMessage: "Emergency contact number must be a valid Indian mobile number",
      options: ["en-IN"],
    },
  },
  sessionPrice: {
    isNumeric: {
      errorMessage: "Session price must be a number",
    },
    notEmpty: {
      errorMessage: "Session price is required",
    },
  },
};
