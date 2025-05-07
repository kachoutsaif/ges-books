// ReviewManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/ManagementStyles.css';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    userName: '',
    rating: 5,
    comment: '',
    bookId: '',
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get('/api/reviews');
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/reviews', formData);
      fetchReviews();
      setFormData({ userName: '', rating: 5, comment: '', bookId: '' });
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/reviews/${id}`);
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <div className="management-container">
      <h2 className="section-title">⭐ Gestion des Avis</h2>
      
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label>Utilisateur</label>
          <input
            type="text"
            value={formData.userName}
            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Note</label>
          <select
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
            className="form-select"
          >
            {[5, 4, 3, 2, 1].map((num) => (
              <option key={num} value={num}>{num} ⭐</option>
            ))}
          </select>
        </div>

        <div className="form-group full-width">
          <label>Commentaire</label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label>ID Livre</label>
          <input
            type="text"
            value={formData.bookId}
            onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
            className="form-input"
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
              <p>📚 ID Livre: {review.bookId}</p>
            </div>
            <button 
              onClick={() => handleDelete(review._id)}
              className="delete-button"
            >
              🗑️ Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ReviewManagement;