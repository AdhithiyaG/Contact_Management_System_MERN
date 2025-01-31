const express = require('express');
const multer = require('multer');
const { getContacts, createContact, updateContact, deleteContact } = require('../controllers/contactController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getContacts);
router.post('/', upload.single('profilePhoto'), createContact);
router.put('/:id', upload.single('profilePhoto'), updateContact);
router.delete('/:id', deleteContact);

module.exports = router;
