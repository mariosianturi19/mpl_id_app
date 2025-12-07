import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchTeams, deleteTeam } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import '../styles/pages/Teams.css';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, team: null });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadTeams();
  }, [location.pathname]);

  useEffect(() => {
    if (location.state?.reload) {
      loadTeams();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  const loadTeams = async () => {
    console.log('📋 Loading teams...');
    try {
      setLoading(true);
      const data = await fetchTeams();
      console.log('✅ Teams loaded successfully:', data);
      setTeams(data);
      setError(null);
    } catch (err) {
      console.error('❌ Failed to load teams:', err);
      setError('Failed to load teams.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id, teamName) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, team: { id, name: teamName } });
  };

  const confirmDelete = async () => {
    try {
      await deleteTeam(deleteModal.team.id);
      setDeleteModal({ isOpen: false, team: null });
      await loadTeams();
    } catch (err) {
      alert('Failed to delete team.');
      setDeleteModal({ isOpen: false, team: null });
    }
  };

  const handleEdit = (e, id) => {
    e.stopPropagation();
    navigate(`/team/edit/${id}`);
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={loadTeams} className="btn-retry">Retry</button>
      </div>
    );
  }

  return (
    <div className="teams-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">MPL Teams</h1>
          <p className="page-subtitle">Season 16 Professional League Roster</p>
        </div>
        <button 
          onClick={() => navigate('/create')} 
          className="btn-create-team-header"
        >
          ➕ Create Team
        </button>
      </div>

      {teams.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🛡️</span>
          <h3>No Teams Registered</h3>
          <button onClick={() => navigate('/create')} className="btn-create-floating">
            + Create New Team
          </button>
        </div>
      ) : (
        <div className="teams-grid">
          {teams.map((team) => {
            const teamId = team._id || team.id;
            return (
              <div 
                key={teamId} 
                className="team-card cursor-pointer"
                onClick={() => navigate(`/team/${teamId}`)} // Klik kartu ke halaman View
              >
                {team.logo && <img src={team.logo} alt="" className="card-watermark" />}

                <div className="team-header">
                  <div className="team-logo-wrapper">
                    <img 
                      src={team.logo || 'https://via.placeholder.com/100?text=?'} 
                      alt={team.name} 
                      className="team-logo"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=?'; }}
                    />
                  </div>
                  <div className="team-info">
                    <h3 className="team-name">{team.name}</h3>
                    <span className="team-region">{team.region || 'ID'}</span>
                  </div>
                </div>

                <div className="team-stats-grid">
                  <div className="stat-box">
                    <span className="stat-label">Match</span>
                    <span className="stat-value">{team.matchesWon || 0} - {team.matchesLost || 0}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Game</span>
                    <span className="stat-value">{team.gamesWon || 0} - {team.gamesLost || 0}</span>
                  </div>
                </div>

                <div className="team-actions">
                  <button
                    onClick={(e) => handleEdit(e, teamId)}
                    className="btn-action btn-edit"
                    title="Edit Team"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, teamId, team.name)}
                    className="btn-action btn-delete"
                    title="Delete Team"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Floating Action Button for Create */}
      <button 
        className="fab-create"
        onClick={() => navigate('/create')}
        title="Create Team"
      >
        +
      </button>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, team: null })}
        onConfirm={confirmDelete}
        type="delete"
        title="Delete Team"
        message={`Are you sure you want to delete "${deleteModal.team?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Teams;