// BookManagement.jsx
import React, { useState, useEffect } from 'react';
import '../../styles/ManagementStyles.css';

const fakeBooks = [
  {
    _id: '1',
    title: 'Le Petit Prince',
    author: 'Antoine de Saint-Exupéry',
    isbn: '9782070612758',
    publicationDate: '1943-04-06',
  },
  {
    _id: '2',
    title: '1984',
    author: 'George Orwell',
    isbn: '9780451524935',
    publicationDate: '1949-06-08',
  },
  {
    _id: '3',
    title: 'L’Étranger',
    author: 'Albert Camus',
    isbn: '9782070360024',
    publicationDate: '1942-05-19',
  },
];

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
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks));
    } else {
      setBooks(fakeBooks);
      localStorage.setItem('books', JSON.stringify(fakeBooks));
    }
  }, []);

  const updateLocalStorage = (updatedBooks) => {
    localStorage.setItem('books', JSON.stringify(updatedBooks));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedBooks;

    if (editingId) {
      updatedBooks = books.map((book) =>
        book._id === editingId ? { ...book, ...formData } : book
      );
    } else {
      const newBook = {
        ...formData,
        _id: Date.now().toString(),
      };
      updatedBooks = [newBook, ...books];
    }

    setBooks(updatedBooks);
    updateLocalStorage(updatedBooks);

    setFormData({
      title: '',
      author: '',
      isbn: '',
      publicationDate: '',
    });
    setEditingId(null);
  };

  const handleEdit = (book) => {
    setFormData(book);
    setEditingId(book._id);
  };

  const handleDelete = (id) => {
    const updatedBooks = books.filter((book) => book._id !== id);
    setBooks(updatedBooks);
    updateLocalStorage(updatedBooks);
  };

  return (
    <div className="management-container">
      <h2 className="section-title">📚 Gestion des Livres</h2>

      <div className="items-list">
        {books.length === 0 ? (
          <p className="empty-message">Aucun livre pour le moment.</p>
        ) : (
          books.map((book) => (
            <div key={book._id} className="list-item">
              <div className="item-info">
                <h3>{book.title}</h3>
                <p>📖 Auteur: {book.author}</p>
                <p>🔖 ISBN: {book.isbn}</p>
                <p>📅 Date: {new Date(book.publicationDate).toLocaleDateString()}</p>
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(book)} className="edit-button">
                  ✏️ Modifier
                </button>
                <button onClick={() => handleDelete(book._id)} className="delete-button">
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label>Titre</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label>Auteur</label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label>ISBN</label>
          <input
            type="text"
            value={formData.isbn}
            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label>Date Publication</label>
          <input
            type="date"
            value={formData.publicationDate}
            onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
            className="form-input"
            required
          />
        </div>

        <button type="submit" className="form-button">
          {editingId ? '🔄 Modifier' : '➕ Ajouter'}
        </button>
      </form>
    </div>
  );
};

export default BookManagement;
