import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ContactForm({ selectedContact, onContactUpdated }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    if (selectedContact) {
      setName(selectedContact.name);
      setPhone(selectedContact.phone);
    }
  }, [selectedContact]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    if (profilePhoto) {
      formData.append('profilePhoto', profilePhoto);
    }

    if (selectedContact) {
      console.log('Updating contact:', selectedContact._id);
      axios.put(`http://localhost:5000/contacts/${selectedContact._id}`, formData)
        .then(response => {
          console.log('Contact updated:', response.data);
          setName('');
          setPhone('');
          setProfilePhoto(null);
          onContactUpdated();
        })
        .catch(error => {
          if (error.response && error.response.status === 409) {
            if (window.confirm('Mobile number already exists. Do you want to replace the existing contact?')) {
              const newFormData = new FormData();
              newFormData.append('name', name);
              newFormData.append('phone', phone);
              if (profilePhoto) {
                newFormData.append('profilePhoto', profilePhoto);
              }
              newFormData.append('confirmReplace', true);
              console.log('Sending confirmReplace flag:', true);
              axios.put(`http://localhost:5000/contacts/${selectedContact._id}`, newFormData)
                .then(response => {
                  console.log('Contact replaced:', response.data);
                  setName('');
                  setPhone('');
                  setProfilePhoto(null);
                  onContactUpdated();
                })
                .catch(err => console.error(err));
            }
          } else {
            console.error(error);
          }
        });
    } else {
      console.log('Creating new contact');
      axios.post('http://localhost:5000/contacts', formData)
        .then(response => {
          console.log('New contact created:', response.data);
          setName('');
          setPhone('');
          setProfilePhoto(null);
          onContactUpdated();
        })
        .catch(error => {
          if (error.response && error.response.status === 409) {
            if (window.confirm('Mobile number already exists. Do you want to replace the existing contact?')) {
              const newFormData = new FormData();
              newFormData.append('name', name);
              newFormData.append('phone', phone);
              if (profilePhoto) {
                newFormData.append('profilePhoto', profilePhoto);
              }
              newFormData.append('confirmReplace', true);
              console.log('Sending confirmReplace flag for new contact:', true);
              axios.post('http://localhost:5000/contacts', newFormData)
                .then(response => {
                  console.log('Existing contact replaced:', response.data);
                  setName('');
                  setPhone('');
                  setProfilePhoto(null);
                  onContactUpdated();
                })
                .catch(err => console.error(err));
            }
          } else {
            console.error(error);
          }
        });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Phone</label>
        <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Profile Photo</label>
        <input type="file" className="form-control" onChange={(e) => setProfilePhoto(e.target.files[0])} />
      </div>
      <button type="submit" className="btn btn-primary">{selectedContact ? 'Update Contact' : 'Add Contact'}</button>
    </form>
  );
}

export default ContactForm;
