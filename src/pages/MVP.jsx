import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchMVPs, deleteMVP } from '../services/mvpApi';
import LoadingSpinner from '../components/LoadingSpinner';
import './MVP.css';

const MVP = () => {
  const [mvps, setMvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadMVPs();
  }, [location.pathname]);

  useEffect(() => {
    if (location.state?.reload) {
      console.log('Reloading MVPs due to state change...');
      loadMVPs();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  const loadMVPs = async () => {
    try {
      setLoading(true);
      const data = await fetchMVPs();
      console.log('MVP data:', data);
      
      // Sort by points descending
      const sortedMVPs = data.sort((a, b) => (b.points || 0) - (a.points || 0));
      setMvps(sortedMVPs);
      setError(null);
    } catch (err) {
      setError('Failed to load MVPs. Please try again later.');
      console.error('Error loading MVPs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, ign) => {
    if (window.confirm(`Are you sure you want to delete ${ign}?`)) {
      try {
        await deleteMVP(id);
        await loadMVPs();
        alert('MVP deleted successfully!');
      } catch (err) {
        alert('Failed to delete MVP. Please try again.');
        console.error('Error deleting MVP:', err);
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={loadMVPs} className="btn-retry">Retry</button>
      </div>
    );
  }

  return (
    <div className="mvp-page">
      <div className="page-header">
        <h1 className="page-title">🏅 MVP Standings</h1>
        <p className="page-subtitle">Most Valuable Players Rankings</p>
        <button 
          onClick={() => navigate('/mvp/create')} 
          className="btn-create-mvp"
        >
          ➕ Add MVP
        </button>
      </div>

      {mvps.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🏆</span>
          <h3>No MVPs yet</h3>
          <p>Add the first MVP to get started!</p>
          <button onClick={() => navigate('/mvp/create')} className="btn-primary">
            Add MVP
          </button>
        </div>
      ) : (
        <div className="mvp-standings">
          <div className="mvp-table">
            <div className="mvp-table-header">
              <div className="mvp-col-rank">RANK</div>
              <div className="mvp-col-player">PLAYER</div>
              <div className="mvp-col-team">TEAM</div>
              <div className="mvp-col-points">POINTS</div>
              <div className="mvp-col-actions">ACTIONS</div>
            </div>

            <div className="mvp-table-body">
              {mvps.map((mvp, index) => {
                const rank = index + 1;
                let rankClass = 'mvp-row';
                if (rank === 1) rankClass += ' rank-1';
                else if (rank === 2) rankClass += ' rank-2';
                else if (rank === 3) rankClass += ' rank-3';

                return (
                  <div key={mvp._id || mvp.id} className={rankClass}>
                    <div className="mvp-col-rank">
                      <span className="rank-badge">
                        {rank === 1 && '🥇 '}
                        {rank === 2 && '🥈 '}
                        {rank === 3 && '🥉 '}
                        {rank}.
                      </span>
                    </div>

                    <div className="mvp-col-player">
                      <div className="player-info">
                        {mvp.photo && (
                          <img 
                            src={mvp.photo} 
                            alt={mvp.ign} 
                            className="player-photo"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <span className="player-ign">{mvp.ign}</span>
                      </div>
                    </div>

                    <div className="mvp-col-team">
                      <span className="team-name">{mvp.teamName}</span>
                    </div>

                    <div className="mvp-col-points">
                      <span className="mvp-points">{mvp.points || 0}</span>
                    </div>

                    <div className="mvp-col-actions">
                      <button
                        onClick={() => navigate(`/mvp/edit/${mvp._id || mvp.id}`, { state: { mvp } })}
                        className="btn-edit-mvp"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(mvp._id || mvp.id, mvp.ign)}
                        className="btn-delete-mvp"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MVP;
