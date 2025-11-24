import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchTeams, deleteTeam } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './Teams.css';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadTeams();
  }, [location.pathname]); // Reload when pathname changes

  // Reload data when coming back from edit with reload state
  useEffect(() => {
    if (location.state?.reload) {
      console.log('Reloading teams due to state change...'); // Debug
      loadTeams();
      // Clear the state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const data = await fetchTeams();
      console.log('Teams data:', data); // Debug log
      setTeams(data);
      setError(null);
    } catch (err) {
      setError('Failed to load teams. Please try again later.');
      console.error('Error loading teams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, teamName) => {
    if (window.confirm(`Are you sure you want to delete ${teamName}?`)) {
      try {
        await deleteTeam(id);
        // Reload fresh data from API instead of just filtering
        await loadTeams();
        alert('Team deleted successfully!');
      } catch (err) {
        alert('Failed to delete team. Please try again.');
        console.error('Error deleting team:', err);
      }
    }
  };

  const calculateWinRate = (matchesWon, matchesLost) => {
    const total = matchesWon + matchesLost;
    return total > 0 ? ((matchesWon / total) * 100).toFixed(1) : '0.0';
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
        <h1 className="page-title">🏆 MPL Teams</h1>
        <p className="page-subtitle">Manage all Mobile Legends Professional teams</p>
      </div>

      {teams.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <h3>No teams yet</h3>
          <p>Create your first team to get started!</p>
          <button onClick={() => navigate('/create')} className="btn-primary">
            Create Team
          </button>
        </div>
      ) : (
        <div className="teams-grid">
          {teams.map((team) => (
            <div key={team._id || team.id} className="team-card">
              <div className="team-header">
                {team.logo && (
                  <img src={team.logo} alt={team.name} className="team-logo" />
                )}
                <div className="team-info">
                  <h3 className="team-name">{team.name}</h3>
                  <p className="team-region">{team.region || 'Indonesia'}</p>
                </div>
              </div>

              <div className="team-stats">
                <div className="stat-item">
                  <span className="stat-label">Win Rate</span>
                  <span className="stat-value">
                    {calculateWinRate(team.matchesWon || 0, team.matchesLost || 0)}%
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Matches</span>
                  <span className="stat-value">
                    {(team.matchesWon || 0) + (team.matchesLost || 0)}
                  </span>
                </div>
              </div>

              <div className="team-record">
                <div className="record-item win">
                  <span className="record-label">Won</span>
                  <span className="record-value">{team.matchesWon || 0}</span>
                </div>
                <div className="record-item loss">
                  <span className="record-label">Lost</span>
                  <span className="record-value">{team.matchesLost || 0}</span>
                </div>
              </div>

              <div className="team-players">
                <h4>Players</h4>
                <div className="players-list">
                  {team.players?.map((player, idx) => (
                    <div key={idx} className="player-item">
                      <span className="player-role">{player.role}</span>
                      <span className="player-name">{player.ign}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="team-actions">
                <button
                  onClick={() => {
                    const teamId = team._id || team.id;
                    console.log('Navigating to team:', teamId); // Debug log
                    if (teamId) {
                      navigate(`/team/${teamId}`);
                    } else {
                      alert('Team ID not found!');
                    }
                  }}
                  className="btn-edit"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(team._id || team.id, team.name)}
                  className="btn-delete"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Teams;
