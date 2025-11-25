import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchTeams } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './TeamsRoster.css';

const TeamsRoster = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadTeams();
  }, [location.pathname]);

  const loadTeams = async () => {
    console.log('📋 Loading teams roster...');
    try {
      setLoading(true);
      const data = await fetchTeams();
      console.log('✅ Teams roster loaded:', data);
      setTeams(data);
      setError(null);
    } catch (err) {
      console.error('❌ Failed to load teams roster:', err);
      setError('Failed to load teams.');
    } finally {
      setLoading(false);
    }
  };

  const getRosterArray = (team) => {
    return [
      { ign: team.member1 },
      { ign: team.member2 },
      { ign: team.member3 },
      { ign: team.member4 },
      { ign: team.member5 },
    ];
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
    <div className="teams-roster-page">
      <div className="page-header">
        <h1 className="page-title">🏆 MPL ID Teams</h1>
        <p className="page-subtitle">Complete Roster & Coaching Staff</p>
      </div>

      {teams.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">�</span>
          <h3>No teams found</h3>
          <p>Add teams to get started!</p>
        </div>
      ) : (
        <div className="teams-roster-grid">
          {teams.map((team) => {
            const roster = getRosterArray(team);
            
            return (
              <div key={team._id || team.id} className="team-roster-card">
                {/* Team Header */}
                <div className="team-roster-header">
                  <div className="team-logo-wrapper">
                    <img
                      src={team.logo || 'https://via.placeholder.com/80?text=?'}
                      alt={team.name}
                      className="team-logo-roster"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80?text=?';
                      }}
                    />
                  </div>
                  <div className="team-info-roster">
                    <h2 className="team-name-roster">{team.name}</h2>
                    <div className="team-stats-mini">
                      <span className="stat-mini wins">
                        {team.matchesWon || 0}W
                      </span>
                      <span className="stat-divider">-</span>
                      <span className="stat-mini losses">
                        {team.matchesLost || 0}L
                      </span>
                    </div>
                  </div>
                </div>

                {/* Roster */}
                <div className="roster-list">
                  <h3 className="roster-section-title">Main Roster</h3>
                  <div className="players-list">
                    {roster.map((player, idx) => (
                      <div key={idx} className="player-row">
                        <span className="player-ign-text">
                          {player.ign || 'TBA'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coach */}
                <div className="coach-section-mini">
                  <div className="coach-row">
                    <span className="coach-name-text">
                      {team.coach || 'TBA'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeamsRoster;
