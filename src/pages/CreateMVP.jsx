import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMVP } from '../services/api';
import Modal from '../components/Modal';
import '../styles/pages/CreateMVP.css';

const CreateMVP = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    ign: '',
    teamName: '',
    points: 0,
    photo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'points' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.ign.trim()) {
      alert('Player IGN is required!');
      return;
    }

    if (!formData.teamName.trim()) {
      alert('Team name is required!');
      return;
    }

    try {
      setLoading(true);
      await createMVP(formData);
      setSuccessModal(true);
    } catch (err) {
      alert('Failed to create MVP. Please try again.');
      console.error('Error creating MVP:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setSuccessModal(false);
    navigate('/mvp', { state: { reload: true, timestamp: Date.now() } });
  };

  return (
    <div className="create-mvp-page">
      <div className="form-container">
        <div className="form-header">
          <h1 className="form-title">➕ Add New MVP</h1>
          <p className="form-subtitle">Add a new player to MVP standings</p>
        </div>

        <form onSubmit={handleSubmit} className="mvp-form">
          <div className="form-section">
            <h3 className="section-title">Player Information</h3>
            
            <div className="form-group">
              <label htmlFor="ign">Player IGN (In-Game Name) *</label>
              <input
                type="text"
                id="ign"
                name="ign"
                value={formData.ign}
                onChange={handleChange}
                placeholder="e.g., Kiboy"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="teamName">Team Name *</label>
              <input
                type="text"
                id="teamName"
                name="teamName"
                value={formData.teamName}
                onChange={handleChange}
                placeholder="e.g., ONIC"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="points">MVP Points *</label>
              <input
                type="number"
                id="points"
                name="points"
                value={formData.points}
                onChange={handleChange}
                placeholder="150"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="photo">Photo URL</label>
              <input
                type="url"
                id="photo"
                name="photo"
                value={formData.photo}
                onChange={handleChange}
                placeholder="https://example.com/player.png"
              />
              <small>Enter the URL of the player's photo</small>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/mvp')}
              className="btn-cancel"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create MVP'}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={successModal}
        onClose={handleSuccessModalClose}
        onConfirm={handleSuccessModalClose}
        type="success"
        title="MVP Added!"
        message={`"${formData.ign}" from ${formData.teamName} has been added to the MVP race.`}
        confirmText="Go to MVP"
        cancelText="Close"
      />
    </div>
  );
};

export default CreateMVP;
