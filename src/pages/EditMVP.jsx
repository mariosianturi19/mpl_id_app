import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { updateMVP } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import '../styles/pages/EditMVP.css';

const EditMVP = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successModal, setSuccessModal] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    // Get MVP data from navigation state
    if (location.state?.mvp) {
      console.log('MVP data from state:', location.state.mvp);
      setFormData(location.state.mvp);
    } else {
      setError('MVP data not found. Please go back and try again.');
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'points' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData || !formData.ign || !formData.ign.trim()) {
      alert('Player IGN is required!');
      return;
    }

    if (!formData.teamName || !formData.teamName.trim()) {
      alert('Team name is required!');
      return;
    }

    try {
      setSaving(true);
      
      const updateData = {
        ign: formData.ign,
        teamName: formData.teamName,
        points: formData.points || 0,
        photo: formData.photo || '',
      };
      
      console.log('Sending to API:', updateData);
      
      await updateMVP(id, updateData);
      setSuccessModal(true);
    } catch (err) {
      alert('Failed to update MVP. Please try again.');
      console.error('Error updating MVP:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSuccessModalClose = () => {
    setSuccessModal(false);
    navigate('/mvp', { state: { reload: true, timestamp: Date.now() } });
  };

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => navigate('/mvp')} className="btn-retry">
          ← Back to MVP List
        </button>
      </div>
    );
  }

  if (!formData) return <LoadingSpinner />;

  return (
    <div className="edit-mvp-page">
      <div className="form-container">
        <div className="form-header">
          <h1 className="form-title">✏️ Edit MVP</h1>
          <p className="form-subtitle">Update {formData?.ign} information</p>
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
                value={formData.ign || ''}
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
                value={formData.teamName || ''}
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
                value={formData.points || 0}
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
                value={formData.photo || ''}
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
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
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
        title="MVP Updated!"
        message={`"${formData?.ign}" from ${formData?.teamName} has been successfully updated.`}
        confirmText="Go to MVP"
        cancelText="Close"
      />
    </div>
  );
};

export default EditMVP;
