import mongoose from 'mongoose';

const mailSchema = new mongoose.Schema({
    senderName: String,
    senderEmail: String,
    dateTime: Date,
    subject: String,
    bodyPreview: String,
    attachmentNames: [String],
    downloadURL: String,
    extractedData: mongoose.Schema.Types.Mixed, // Use this type if the structure of extractedData is not fixed
});
mailSchema.index({ senderEmail: 1, dateTime: 1 }, { unique: true });
export const Mails = mongoose.models.Mails || mongoose.model('Mails', mailSchema);