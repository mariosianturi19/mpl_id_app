import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTeamById, updateTeam } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './TeamDetail.css';

const TeamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [team, setTeam] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (id) {
      loadTeam();
    }
  }, [id]);

  const loadTeam = async () => {
    if (!id) {
      setError('Team ID is missing');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await fetchTeamById(id);
      console.log('Team data loaded:', data); // Debug log
      
      // Convert API format (member1, member2, etc.) to our format (players array)
      const players = [
        { ign: data.member1 || '', role: 'EXP Laner' },
        { ign: data.member2 || '', role: 'Jungler' },
        { ign: data.member3 || '', role: 'Mid Laner' },
        { ign: data.member4 || '', role: 'Gold Laner' },
        { ign: data.member5 || '', role: 'Roamer' },
      ];
      
      // Convert API format (coach string) to our format (coaches array)
      const coaches = [
        { name: data.coach || '', role: 'Head Coach' }
      ];
      
      // Add reserve players if they exist
      if (data.reserve1 || data.reserve2) {
        // We'll keep these in the data but won't show in the form for now
      }
      
      // Create formatted data
      const formattedData = {
        ...data,
        players: players,
        coaches: coaches
      };
      
      console.log('Players:', players); // Debug players
      console.log('Coaches:', coaches); // Debug coaches
      console.log('Processed data:', formattedData); // Debug processed data
      
      setTeam(formattedData);
      setFormData(formattedData);
      setError(null);
    } catch (err) {
      setError('Failed to load team. Please try again later.');
      console.error('Error loading team:', err);
    } finally {
      setLoading(false);
    }
  };

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
      setSaving(true);
      
      // Convert our format back to API format
      const apiData = {
        name: formData.name,
        logo: formData.logo,
        coach: formData.coaches[0]?.name || '',
        member1: formData.players[0]?.ign || '',
        member2: formData.players[1]?.ign || '',
        member3: formData.players[2]?.ign || '',
        member4: formData.players[3]?.ign || '',
        member5: formData.players[4]?.ign || '',
        matchesWon: formData.matchesWon || 0,
        matchesLost: formData.matchesLost || 0,
        gamesWon: formData.gamesWon || 0,
        gamesLost: formData.gamesLost || 0,
      };
      
      console.log('Sending to API:', apiData); // Debug
      
      await updateTeam(id, apiData);
      alert('Team updated successfully!');
      // Navigate with state to trigger reload
      navigate('/', { state: { reload: true, timestamp: Date.now() } });
    } catch (err) {
      alert('Failed to update team. Please try again.');
      console.error('Error updating team:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={loadTeam} className="btn-retry">Retry</button>
      </div>
    );
  }

  if (!formData) return null;

  return (
    <div className="team-detail-page">
      <div className="form-container">
        <div className="form-header">
          <h1 className="form-title">✏️ Edit Team</h1>
          <p className="form-subtitle">Update {team?.name} information</p>
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
                value={formData.logo || ''}
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
                value={formData.region || ''}
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
                  value={formData.matchesWon || 0}
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
                  value={formData.matchesLost || 0}
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
                  value={formData.gamesWon || 0}
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
                  value={formData.gamesLost || 0}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Players */}
          <div className="form-section">
            <h3 className="section-title">Players Lineup *</h3>
            
            {formData.players?.map((player, index) => (
              <div key={index} className="player-input-group">
                <div className="form-group">
                  <label>Role</label>
                  <input
                    type="text"
                    value={player?.role || ''}
                    onChange={(e) => handlePlayerChange(index, 'role', e.target.value)}
                    placeholder="Role"
                  />
                </div>
                <div className="form-group">
                  <label>IGN (In-Game Name)</label>
                  <input
                    type="text"
                    value={player?.ign || ''}
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
            
            {formData.coaches?.map((coach, index) => (
              <div key={index} className="coach-input-group">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={coach?.name || ''}
                    onChange={(e) => handleCoachChange(index, 'name', e.target.value)}
                    placeholder="Coach name"
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input
                    type="text"
                    value={coach?.role || ''}
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
    </div>
  );
};

export default TeamDetail;
