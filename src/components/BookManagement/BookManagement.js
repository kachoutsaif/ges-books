// BookManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/ManagementStyles.css';
const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publicationDate: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/api/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/books/${editingId}`, formData);
      } else {
        await axios.post('/api/books', formData);
      }
      fetchBooks();
      setFormData({ title: '', author: '', isbn: '', publicationDate: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleEdit = (book) => {
    setFormData(book);
    setEditingId(book._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div className="management-container">
      <h2 className="section-title">📚 Gestion des Livres</h2>
      
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label>Titre</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Auteur</label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>ISBN</label>
          <input
            type="text"
            value={formData.isbn}
            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Date Publication</label>
          <input
            type="date"
            value={formData.publicationDate}
            onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
            className="form-input"
          />
        </div>

        <button type="submit" className="form-button">
          {editingId ? '🔄 Modifier' : '➕ Ajouter'}
        </button>
      </form>

      <div className="items-list">
        {books.map((book) => (
          <div key={book._id} className="list-item">
            <div className="item-info">
              <h3>{book.title}</h3>
              <p>📖 Auteur: {book.author}</p>
              <p>🔖 ISBN: {book.isbn}</p>
              <p>📅 Date: {new Date(book.publicationDate).toLocaleDateString()}</p>
            </div>
            <div className="item-actions">
              <button 
                onClick={() => handleEdit(book)}
                className="edit-button"
              >
                ✏️ Modifier
              </button>
              <button 
                onClick={() => handleDelete(book._id)}
                className="delete-button"
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default BookManagement;
