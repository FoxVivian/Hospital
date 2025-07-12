import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const medicalRecordSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },
    appointmentId: { type: String, required: true },
    patientId: { type: String, required: true },
    patientName: { type: String, required: true },
    doctorId: { type: String, required: true },
    doctorName: { type: String, required: true },
    department: { type: String, required: true },
    visitDate: { type: String, required: true },
    visitTime: { type: String, required: true },
    chiefComplaint: { type: String, required: true },
    symptoms: { type: String, required: true },
    vitalSigns: {
        temperature: { type: String, required: true },
        bloodPressure: { type: String, required: true },
        heartRate: { type: String, required: true },
        respiratoryRate: { type: String, required: true },
        weight: { type: String, required: true },
        height: { type: String, required: true }
    },
    physicalExamination: { type: String, required: true },
    diagnosis: { type: String, required: true },
    icdCode: { type: String }, // Optional
    treatment: { type: String, required: true },
    prescription: [{
        id: { type: String, default: uuidv4, unique: true },
        medicineId: { type: String, required: true },
        medicineName: { type :String ,required :true},
        dosage :{type :String ,required :true},
        frequency :{type :String ,required :true},
        duration :{type :String ,required :true},
        instructions: { type: String, required: true },
        quantity: { type: Number, required: true },
     }],
    labTests:{type:[String],default :[]},
    followUpDate:{type:String},
    followUpInstructions:{type:String},
    status:{type:String ,enum:['draft','completed'],default:'draft'},
    }, {
    timestamps:true
})

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);
export default MedicalRecord;