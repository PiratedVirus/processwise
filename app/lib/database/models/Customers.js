import mongoose from 'mongoose';

const mailboxSchema = new mongoose.Schema({
    mailboxName: String,
    mails: []
});

const customerSchema = new mongoose.Schema({
  customerName: String,
  mailboxes: [mailboxSchema]
});

export const Customers = mongoose.models.Customers || mongoose.model('Customers', customerSchema);