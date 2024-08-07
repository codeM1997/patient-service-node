import { Schema } from "mongoose";
import mongoose from "mongoose";

const PatientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
    unique: true,
  },
  sessionPrice: {
    type: Number,
    required: true,
  },
  emergencyContact: {
    name: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
      isUnique: false,
    },
    relationshipWithPatient: {
      type: String,
      required: true,
    },
  },
});

const Patient = mongoose.model("Patient", PatientSchema);
export default Patient;