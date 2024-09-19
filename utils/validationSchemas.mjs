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
      options: {
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
      options: [["male", "female", "trans", "other"]],
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
  emergencyContact: {
    notEmpty: {
      errorMessage: "Emergency contact is required",
    },
    isObject: {
      errorMessage: "Emergency contact must be an object",
    },
  },
  "emergencyContact.name": {
    notEmpty: {
      errorMessage: "Emergency contact name is required",
    },
    isString: {
      errorMessage: "Emergency contact name must be a string",
    },
  },
  "emergencyContact.number": {
    notEmpty: {
      errorMessage: "Emergency contact number is required",
    },
    isNumeric: true,
    isMobilePhone: {
      errorMessage:
        "Emergency contact number must be a valid Indian mobile number",
      options: ["en-IN"],
    },
  },
  "emergencyContact.relationshipWithPatient": {
    notEmpty: {
      errorMessage: "Emergency contact relationship with patient is required",
    },
    isString: {
      errorMessage:
        "Emergency contact relationship with patient must be a string",
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

export const adminSchema = {
  username: {
    notEmpty: {
      errorMessage: "Name is required",
    },
    isString: {
      errorMessage: "Name must be a string",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Password is required",
    },
    isString: {
      errorMessage: "Password must be a string",
    },
    isStrongPassword: {
      errorMessage: "Password must be strong",
      options: {
        minLength: 8,
        maxLength: 20,
        minUppercase: 1,
        minSymbols: 1,
        minNumbers: 1,
      },
    },
  },
};
