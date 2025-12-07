import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTeamById, updateTeam } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import '../styles/pages/TeamDetail.css';

const TeamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successModal, setSuccessModal] = useState(false);
  
  // State awal null, akan diisi saat loadTeam selesai
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (id) {
      loadTeam();
    }
  }, [id]);

  // --- 1. LOAD DATA ---
  const loadTeam = async () => {
    try {
      setLoading(true);
      const data = await fetchTeamById(id);
      
      // Mapping data pemain untuk form
      const players = [
        { ign: data.member1 || '', role: 'EXP Laner' },
        { ign: data.member2 || '', role: 'Jungler' },
        { ign: data.member3 || '', role: 'Mid Laner' },
        { ign: data.member4 || '', role: 'Gold Laner' },
        { ign: data.member5 || '', role: 'Roamer' },
      ];
      
      // Mapping data coach
      const coaches = [
        { name: data.coach || '', role: 'Head Coach' }
      ];

      setFormData({
        ...data,
        region: data.region || '', 
        logo: data.logo || '',
        matchesWon: data.matchesWon || 0,
        matchesLost: data.matchesLost || 0,
        gamesWon: data.gamesWon || 0,
        gamesLost: data.gamesLost || 0,
        reserve1: data.reserve1 || '',
        reserve2: data.reserve2 || '',
        players: players,
        coaches: coaches,
        // PERBAIKAN 1: Pastikan statistik masuk ke state (Default 0 jika null)
        matchesWon: data.matchesWon || 0,
        matchesLost: data.matchesLost || 0,
        gamesWon: data.gamesWon || 0,
        gamesLost: data.gamesLost || 0,
      });
      
      setError(null);
    } catch (err) {
      setError('Failed to load team details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. HANDLE CHANGE ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      // PERBAIKAN 2: Jika input adalah statistik, ubah jadi integer agar tidak error di database
      [name]: (name.includes('matches') || name.includes('games')) 
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

  // --- 3. SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Team name is required!');
      return;
    }

    try {
      setSaving(true);
      
      // Siapkan payload data untuk dikirim ke API
      const apiData = {
        name: formData.name,
        logo: formData.logo || '',
        coach: formData.coaches[0]?.name || '',
        member1: formData.players[0]?.ign || '',
        member2: formData.players[1]?.ign || '',
        member3: formData.players[2]?.ign || '',
  member4: formData.players[3]?.ign || '',
  member5: formData.players[4]?.ign || '',
  reserve1: formData.reserve1 || '',
  reserve2: formData.reserve2 || '',

  // PERBAIKAN 3: Sertakan data statistik dalam request update
  matchesWon: formData.matchesWon,
  matchesLost: formData.matchesLost,
  gamesWon: formData.gamesWon,
  gamesLost: formData.gamesLost,
};

      await updateTeam(id, apiData);
      setSuccessModal(true);
      
    } catch (err) {
      console.error('Error updating:', err);
      alert('Failed to update team. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSuccessModalClose = () => {
    setSuccessModal(false);
    // Redirect kembali ke halaman teams dan trigger reload
    navigate('/teams', { state: { reload: true, timestamp: Date.now() } });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return (
    <div className="team-detail-page">
      <div className="error-container" style={{textAlign:'center', padding:'4rem'}}>
        <p style={{color:'#f87171', marginBottom:'1rem'}}>{error}</p>
        <button 
          onClick={loadTeam} 
          style={{
            padding:'0.8rem 1.5rem', 
            background:'rgba(255,255,255,0.1)', 
            color:'#fff', 
            border:'none', 
            borderRadius:'8px',
            cursor:'pointer'
          }}
        >
          Retry
        </button>
      </div>
    </div>
  );
  if (!formData) return null;

  return (
    <div className="team-detail-page">
      <div className="form-container">
        <div className="form-header">
          <h1 className="form-title">Edit Team</h1>
          <p className="form-subtitle">Updating details for {formData.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="team-form">
          
          {/* --- General Info Section --- */}
          <div className="form-section">
            <h3 className="section-title">General Information</h3>
            
            <div className="form-group">
              <label htmlFor="name">Team Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. RRQ Hoshi"
                required
                autoComplete="off"
              />
            </div>

            <div className="form-grid-2">
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
              <div className="form-group">
                <label htmlFor="logo">Logo URL</label>
                <input
                  type="url"
                  id="logo"
                  name="logo"
                  value={formData.logo || ''}
                  onChange={handleChange}
                  placeholder="https://..."
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          {/* --- PERBAIKAN 4: UI Section Statistics --- */}
          <div className="form-section">
            <h3 className="section-title">Team Statistics</h3>
            
            <div className="form-grid-2">
              <div className="form-group">
                <label>Match Won</label>
                <input
                  type="number"
                  name="matchesWon"
                  value={formData.matchesWon}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Match Lost</label>
                <input
                  type="number"
                  name="matchesLost"
                  value={formData.matchesLost}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Game Won</label>
                <input
                  type="number"
                  name="gamesWon"
                  value={formData.gamesWon}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Game Lost</label>
                <input
                  type="number"
                  name="gamesLost"
                  value={formData.gamesLost}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* --- Players Section --- */}
          <div className="form-section">
            <h3 className="section-title">Active Roster</h3>
            
            {formData.players.map((player, index) => (
              <div key={index} className="player-input-group">
                <div className="form-group">
                  <label>Role</label>
                  <input
                    type="text"
                    value={player.role}
                    readOnly
                    className="input-readonly"
                    tabIndex="-1" 
                  />
                </div>
                <div className="form-group">
                  <label>IGN (In-Game Name) *</label>
                  <input
                    type="text"
                    value={player.ign}
                    onChange={(e) => handlePlayerChange(index, 'ign', e.target.value)}
                    placeholder={`Enter ${player.role}`}
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          {/* --- Coach Section --- */}
          <div className="form-section">
            <h3 className="section-title">Staff</h3>
            <div className="coach-input-group">
              <div className="form-group">
                <label>Head Coach Name</label>
                <input
                  type="text"
                  value={formData.coaches[0]?.name || ''}
                  onChange={(e) => handleCoachChange(0, 'name', e.target.value)}
                  placeholder="Enter Coach Name"
                />
              </div>
            </div>
          </div>

          {/* --- Reserves Section --- */}
          <div className="form-section">
            <h3 className="section-title">Reserves</h3>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Reserve 1</label>
                <input
                  type="text"
                  name="reserve1"
                  value={formData.reserve1}
                  onChange={handleChange}
                  placeholder="Reserve Player 1"
                />
              </div>
              <div className="form-group">
                <label>Reserve 2</label>
                <input
                  type="text"
                  name="reserve2"
                  value={formData.reserve2}
                  onChange={handleChange}
                  placeholder="Reserve Player 2"
                />
              </div>
            </div>
          </div>

          {/* --- Action Buttons --- */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/teams')}
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
              {saving ? 'Saving Changes...' : 'Save Update'}
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
        title="Team Updated!"
        message={`${formData?.name} has been successfully updated.`}
        confirmText="Go to Teams"
        cancelText="Close"
      />
    </div>
  );
};

export default TeamDetail;