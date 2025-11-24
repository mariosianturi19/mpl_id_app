import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTeam } from '../services/api';
import './CreateTeam.css';

const CreateTeam = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    region: 'Indonesia',
    matchesWon: 0,
    matchesLost: 0,
    gamesWon: 0,
    gamesLost: 0,
    players: [
      { ign: '', role: 'EXP Laner' },
      { ign: '', role: 'Jungler' },
      { ign: '', role: 'Mid Laner' },
      { ign: '', role: 'Gold Laner' },
      { ign: '', role: 'Roamer' },
    ],
    coaches: [{ name: '', role: 'Head Coach' }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('matches') || name.includes('games') 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handlePlayerChange = (index, field, value) => {
    const newPlayers = [...formData.players];
    newPlayers[index][field] = value;
    setFormData(prev => ({ ...prev, players: newPlayers }));
  };

  const handleCoachChange = (index, field, value) => {
    const newCoaches = [...formData.coaches];
    newCoaches[index][field] = value;
    setFormData(prev => ({ ...prev, coaches: newCoaches }));
  };

  const addCoach = () => {
    setFormData(prev => ({
      ...prev,
      coaches: [...prev.coaches, { name: '', role: 'Assistant Coach' }]
    }));
  };

  const removeCoach = (index) => {
    if (formData.coaches.length > 1) {
      setFormData(prev => ({
        ...prev,
        coaches: prev.coaches.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData || !formData.name || !formData.name.trim()) {
      alert('Team name is required!');
      return;
    }

    // Check if players array exists and all players are filled
    if (!formData.players || !Array.isArray(formData.players)) {
      alert('Players data is missing!');
      return;
    }

    const allPlayersFilled = formData.players.every(p => p && p.ign && p.ign.trim());
    if (!allPlayersFilled) {
      alert('All player IGNs are required!');
      return;
    }

    try {
      setLoading(true);
      await createTeam(formData);
      alert('Team created successfully!');
      navigate('/', { state: { reload: true, timestamp: Date.now() } });
    } catch (err) {
      alert('Failed to create team. Please try again.');
      console.error('Error creating team:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-team-page">
      <div className="form-container">
        <div className="form-header">
          <h1 className="form-title">➕ Create New Team</h1>
          <p className="form-subtitle">Add a new MPL team to the roster</p>
        </div>

        <form onSubmit={handleSubmit} className="team-form">
          {/* Team Information */}
          <div className="form-section">
            <h3 className="section-title">Team Information</h3>
            
            <div className="form-group">
              <label htmlFor="name">Team Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., RRQ Hoshi"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="logo">Logo URL</label>
              <input
                type="url"
                id="logo"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="form-group">
              <label htmlFor="region">Region</label>
              <input
                type="text"
                id="region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                placeholder="Indonesia"
              />
            </div>
          </div>

          {/* Statistics */}
          <div className="form-section">
            <h3 className="section-title">Statistics</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="matchesWon">Matches Won</label>
                <input
                  type="number"
                  id="matchesWon"
                  name="matchesWon"
                  value={formData.matchesWon}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="matchesLost">Matches Lost</label>
                <input
                  type="number"
                  id="matchesLost"
                  name="matchesLost"
                  value={formData.matchesLost}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="gamesWon">Games Won</label>
                <input
                  type="number"
                  id="gamesWon"
                  name="gamesWon"
                  value={formData.gamesWon}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="gamesLost">Games Lost</label>
                <input
                  type="number"
                  id="gamesLost"
                  name="gamesLost"
                  value={formData.gamesLost}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Players */}
          <div className="form-section">
            <h3 className="section-title">Players Lineup *</h3>
            
            {formData.players.map((player, index) => (
              <div key={index} className="player-input-group">
                <div className="form-group">
                  <label>Role</label>
                  <input
                    type="text"
                    value={player.role}
                    onChange={(e) => handlePlayerChange(index, 'role', e.target.value)}
                    placeholder="Role"
                  />
                </div>
                <div className="form-group">
                  <label>IGN (In-Game Name)</label>
                  <input
                    type="text"
                    value={player.ign}
                    onChange={(e) => handlePlayerChange(index, 'ign', e.target.value)}
                    placeholder="Player IGN"
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Coaches */}
          <div className="form-section">
            <h3 className="section-title">Coaching Staff</h3>
            
            {formData.coaches.map((coach, index) => (
              <div key={index} className="coach-input-group">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={coach.name}
                    onChange={(e) => handleCoachChange(index, 'name', e.target.value)}
                    placeholder="Coach name"
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input
                    type="text"
                    value={coach.role}
                    onChange={(e) => handleCoachChange(index, 'role', e.target.value)}
                    placeholder="Coach role"
                  />
                </div>
                {formData.coaches.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCoach(index)}
                    className="btn-remove-coach"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={addCoach}
              className="btn-add-coach"
            >
              ➕ Add Coach
            </button>
          </div>

          {/* Submit Buttons */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
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
              {loading ? 'Creating...' : 'Create Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeam;
