import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTeamById } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/pages/TeamView.css';

const TeamView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTeamDetail();
  }, [id]);

  const loadTeamDetail = async () => {
    try {
      setLoading(true);
      const data = await fetchTeamById(id);
      
      // Mapping data flat (member1..5) ke array objects
      const roster = [
        { role: 'EXP Laner', ign: data.member1, icon: '⚔️' },
        { role: 'Jungler', ign: data.member2, icon: '🌲' },
        { role: 'Mid Laner', ign: data.member3, icon: '🔮' },
        { role: 'Gold Laner', ign: data.member4, icon: '💰' },
        { role: 'Roamer', ign: data.member5, icon: '🛡️' },
      ];

      setTeam({ ...data, roster });
      setError(null);
    } catch (err) {
      setError('Failed to load team details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message text-center mt-4">{error}</div>;
  if (!team) return null;

  return (
    <div className="team-view-page">
      {/* Back Button */}
      <button onClick={() => navigate('/')} className="btn-back">
        ← Back to Teams
      </button>

      {/* Hero Section */}
      <div className="team-hero">
        <div className="hero-bg-glow"></div>
        <div className="team-identity">
          <div className="hero-logo-wrapper">
            <img 
              src={team.logo || 'https://via.placeholder.com/150?text=?'} 
              alt={team.name} 
              className="hero-logo"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=?'; }}
            />
          </div>
          <h1 className="hero-title">{team.name}</h1>
          <span className="hero-region">{team.region || 'MPL Indonesia'}</span>
        </div>

        <div className="hero-stats">
          <div className="hero-stat-item">
            <span className="hs-value text-green">{team.matchesWon || 0}</span>
            <span className="hs-label">Wins</span>
          </div>
          <div className="hero-stat-item">
            <span className="hs-value text-red">{team.matchesLost || 0}</span>
            <span className="hs-label">Losses</span>
          </div>
          <div className="hero-stat-item">
            <span className="hs-value text-blue">{team.gamesWon || 0} - {team.gamesLost || 0}</span>
            <span className="hs-label">Game W-L</span>
          </div>
        </div>
      </div>

      {/* Roster Section */}
      <div className="roster-section">
        <h2 className="section-heading">Main Roster</h2>
        <div className="roster-grid">
          {team.roster.map((player, idx) => (
            <div key={idx} className="player-card">
              <div className="player-role-icon">{player.icon}</div>
              <div className="player-details">
                <span className="player-role-label">{player.role}</span>
                <h3 className="player-ign-label">{player.ign || 'TBA'}</h3>
              </div>
              <div className="card-shine"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Coach Section */}
      <div className="coach-section">
        <h2 className="section-heading">Coaching Staff</h2>
        <div className="coach-card">
          <div className="coach-icon">👔</div>
          <div className="coach-info">
            <span className="coach-role">Head Coach</span>
            <h3 className="coach-name">{team.coach || 'TBA'}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamView;