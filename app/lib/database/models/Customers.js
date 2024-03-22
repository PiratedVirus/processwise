import mongoose from 'mongoose';

const mailSchema = new mongoose.Schema({
    customerName: String,
    mailboxName:  String,
    mailStatus: String,
    senderName: String,
    senderEmail: String,
    dateTime: Date,
    subject: String,
    bodyPreview: String,
    attachmentNames: [String],
    downloadURL: String,
    extractedData: mongoose.Schema.Types.Mixed, // Use this type if the structure of extractedData is not fixed
});

const mailboxSchema = new mongoose.Schema({
    mailboxName: String,
    mails: []
});

const customerSchema = new mongoose.Schema({
  customerName: String,
  mailboxes: [mailboxSchema]
});

export const Customers = mongoose.models.Customers || mongoose.model('Customers', customerSchema);