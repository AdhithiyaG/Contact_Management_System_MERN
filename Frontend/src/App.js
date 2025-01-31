import React, { useState, useEffect } from 'react';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactForm';

function App() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [refreshContacts, setRefreshContacts] = useState(false);

  const handleContactUpdated = () => {
    console.log('Contact updated, refreshing list...'); // Log when contact is updated
    setSelectedContact(null);
    setRefreshContacts(!refreshContacts); // Toggle to refresh contact list
  };

  useEffect(() => {
    console.log('Refresh trigger toggled:', refreshContacts); // Log refresh trigger toggle
    // This effect will run whenever refreshContacts changes, triggering a refresh in ContactList
  }, [refreshContacts]);

  return (
    <div className="container">
      <h1>{'<<<Contact Management System/>>>'}</h1>
      <br></br>
      <h3>{'<Here you can Add,Search,Edit or Delete your Contact Easily...😁/>'}</h3>
      <br></br>
      <ContactForm selectedContact={selectedContact} onContactUpdated={handleContactUpdated} />
      <ContactList onSelectContact={setSelectedContact} refreshTrigger={refreshContacts} />
    </div>
  );
}
export default App;
