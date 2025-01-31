const Contact = require('../models/Contact');

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createContact = async (req, res) => {
  try {
    // Check if a contact with the same phone number already exists
    const existingContact = await Contact.findOne({ phone: req.body.phone });
    
    if (existingContact) {
      // If confirmReplace is true, update the existing contact
      if (req.body.confirmReplace === 'true') {
        existingContact.name = req.body.name;
        if (req.file) {
          existingContact.profilePhoto = req.file.path;
        }
        const updatedContact = await existingContact.save();
        return res.status(200).json(updatedContact);
      }
      // If confirmReplace is not true, return conflict status
      return res.status(409).json({
        message: 'Mobile number already exists. Do you want to replace the existing contact?',
        existingContact
      });
    }

    // Create new contact if no duplicate exists
    const contact = new Contact({
      name: req.body.name,
      phone: req.body.phone,
      profilePhoto: req.file ? req.file.path : null
    });

    const newContact = await contact.save();
    res.status(201).json(newContact);
  } catch (err) {
    console.error('Error in createContact:', err);
    res.status(400).json({ message: err.message });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });

    // Check if a different contact with the same phone number already exists
    const existingContact = await Contact.findOne({ phone: req.body.phone, _id: { $ne: req.params.id } });
    if (existingContact && !req.body.confirmReplace) {
      return res.status(409).json({ message: 'Mobile number already exists. Do you want to replace the existing contact?' });
    }

    contact.name = req.body.name || contact.name;
    contact.phone = req.body.phone || contact.phone;
    contact.profilePhoto = req.file ? req.file.path : contact.profilePhoto;

    const updatedContact = await contact.save();
    res.json(updatedContact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteContact = async (req, res) => {
  console.log('Delete request received for ID:', req.params.id);
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      console.error('Contact not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Contact not found' });
    }

    console.log('Contact deleted for ID:', req.params.id);
    res.json({ message: 'Contact deleted' });
  } catch (err) {
    console.error('Error deleting contact for ID:', req.params.id, err);
    res.status(500).json({ message: err.message });
  }
};
