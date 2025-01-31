import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ContactList({ onSelectContact, refreshTrigger }) {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  const fetchContacts = () => {
    console.log('Fetching contacts...'); // Log when fetching starts
    axios.get('http://localhost:5000/contacts')
      .then(response => {
        console.log('Contacts fetched:', response.data); // Log fetched data
        setContacts(response.data);
      })
      .catch(error => console.error('Error fetching contacts:', error));
  };

  useEffect(() => {
    fetchContacts();
  }, [refreshTrigger]);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/contacts/${id}`)
      .then(response => {
        console.log(response.data);
        setContacts(contacts.filter(contact => contact._id !== id));
      })
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h2>{'<Contact List/>'}</h2>
      <input
        type="text"
        placeholder="Search contacts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="form-control mb-3"
      />
      <ul className="list-group">
        {filteredContacts.map(contact => (
          <li key={contact._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <img src={`http://localhost:5000/${contact.profilePhoto}`} alt="Profile" className="img-thumbnail" style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '10px' }} />
              {contact.name} - {contact.phone}
            </div>
            <div>
              <button className="btn btn-warning btn-sm me-2" onClick={() => onSelectContact(contact)}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(contact._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContactList;
