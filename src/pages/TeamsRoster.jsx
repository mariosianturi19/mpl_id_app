import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchTeams } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/pages/TeamsRoster.css';

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
    console.log(' Loading teams roster...');
    try {
      setLoading(true);
      const data = await fetchTeams();
      console.log(' Teams roster loaded:', data);
      setTeams(data);
      setError(null);
    } catch (err) {
      console.error(' Failed to load teams roster:', err);
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
    <div className="teams-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">MPL Teams</h1>
          <p className="page-subtitle">Season 16 Professional League Roster</p>
        </div>
      </div>

      {teams.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon"></span>
          <h3>No Teams Registered</h3>
        </div>
      ) : (
        <div className="teams-grid">
          {teams.map((team) => {
            const teamId = team._id || team.id;
            const roster = getRosterArray(team);
            
            return (
              <div 
                key={teamId} 
                className="team-card cursor-pointer"
                onClick={() => navigate(/team/)}
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

                <div className="roster-preview-container">
                  <div className="roster-preview-list">
                    {roster.map((player, idx) => (
                      <span key={idx} className="roster-preview-item">
                        {player.ign || 'TBA'}
                      </span>
                    ))}
                  </div>
                  <div className="coach-preview">
                    <span className="coach-label">Coach:</span>
                    <span className="coach-name">{team.coach || 'TBA'}</span>
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
