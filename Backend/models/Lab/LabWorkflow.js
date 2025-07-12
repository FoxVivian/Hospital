import mongoose from "mongoose";

const labWorkflowSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    testId: { type: String, required: true },
    step: {
        type: String,
        enum: ['ordered', 'sample_collection', 'processing', 'analysis', 'verification', 'reporting'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'skipped'],
        default: 'pending'
    },
    assignedTo: { type: String, default: null },
    startedAt: { type: String, default: null },
    completedAt: { type: String, default: null },
    notes: { type: String, default: null },
    duration: { type: Number, default: null } // in minutes
    }, {
    timestamps: true
})
const LabWorkflow = mongoose.model('LabWorkflow', labWorkflowSchema);
export default LabWorkflow;