import React, { useState, useEffect } from 'react';
import '../../styles/ManagementStyles.css';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [books, setBooks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    bookId: '',
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser')) || { username: 'saif.kachout' };
    const storedBooks = JSON.parse(localStorage.getItem('books') || '[]');
    const storedReviews = JSON.parse(localStorage.getItem('reviews') || '[]');

    setCurrentUser(storedUser);
    setBooks(storedBooks);
    setReviews(storedReviews);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newReview = {
      _id: Date.now().toString(),
      userName: currentUser?.username || 'Anonyme',
      rating: formData.rating,
      comment: formData.comment,
      bookId: formData.bookId,
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem('reviews', JSON.stringify(updated));
    setFormData({ rating: 5, comment: '', bookId: '' });
  };

  const handleDelete = (id) => {
    const reviewToDelete = reviews.find((r) => r._id === id);

    if (reviewToDelete.userName !== currentUser?.username) {
      alert("❌ Vous ne pouvez supprimer que vos propres avis !");
      return;
    }

    const updated = reviews.filter((r) => r._id !== id);
    setReviews(updated);
    localStorage.setItem('reviews', JSON.stringify(updated));
  };

  return (
    <div className="management-container">
      <h2 className="section-title">⭐ Gestion des Avis</h2>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label>Note</label>
          <select
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
            className="form-select"
          >
            {[5, 4, 3, 2, 1].map((num) => (
              <option key={num} value={num}>{num} ⭐</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Livre</label>
          <select
            value={formData.bookId}
            onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
            className="form-select"
            required
          >
            <option value="">-- Sélectionner un livre --</option>
            {books.map((book) => (
              <option key={book._id} value={book._id}>
                {book.title} ({book.author})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group full-width">
          <label>Commentaire</label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            className="form-textarea"
            required
          />
        </div>

        <button type="submit" className="form-button">
          📨 Soumettre
        </button>
      </form>

      <div className="items-list">
        {reviews.map((review) => (
          <div key={review._id} className="list-item review-item">
            <div className="item-info">
              <h3>{review.userName} - {review.rating}⭐</h3>
              <p className="comment-text">{review.comment}</p>
              <p>📚 Livre: {
                books.find(b => b._id === review.bookId)?.title || 'Livre inconnu'
              }</p>
            </div>
            {review.userName === currentUser?.username && (
              <button
                onClick={() => handleDelete(review._id)}
                className="delete-button"
              >
                🗑️ Supprimer
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewManagement;
