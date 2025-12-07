import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchMVPs, deleteMVP } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import '../styles/pages/MVP.css';

const MVP = () => {
  const [mvps, setMvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, mvp: null });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadMVPs();
  }, [location.pathname]);

  useEffect(() => {
    if (location.state?.reload) {
      loadMVPs();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  const loadMVPs = async () => {
    console.log('🏅 Loading MVPs...');
    try {
      setLoading(true);
      const data = await fetchMVPs();
      console.log('✅ MVPs loaded successfully:', data);
      // Sort by points descending
      const sortedMVPs = data.sort((a, b) => (b.points || 0) - (a.points || 0));
      setMvps(sortedMVPs);
      setError(null);
    } catch (err) {
      console.error('❌ Failed to load MVPs:', err);
      setError('Failed to load MVPs.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, ign) => {
    setDeleteModal({ isOpen: true, mvp: { id, ign } });
  };

  const confirmDelete = async () => {
    try {
      await deleteMVP(deleteModal.mvp.id);
      setDeleteModal({ isOpen: false, mvp: null });
      await loadMVPs();
    } catch (err) {
      alert('Failed to delete MVP.');
      setDeleteModal({ isOpen: false, mvp: null });
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
        <h1 className="page-title">MVP Race</h1>
        <button 
          onClick={() => navigate('/mvp/create')} 
          className="btn-create-mvp"
        >
          + Add Player
        </button>
      </div>

      {mvps.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🏅</span>
          <h3>No Data Yet</h3>
          <p>Start adding MVP candidates.</p>
        </div>
      ) : (
        <div className="mvp-standings">
          <div className="mvp-table">
            <div className="mvp-table-header">
              <div>Rank</div>
              <div>Player Info</div>
              <div>Team</div>
              <div>Points</div>
              <div>Actions</div>
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
                    {/* Rank */}
                    <div className="mvp-col-rank">
                      <span className="rank-badge">{rank}</span>
                    </div>

                    {/* Player Info */}
                    <div className="mvp-col-player">
                      <div className="player-info">
                        <img 
                          src={mvp.photo || 'https://via.placeholder.com/50?text=?'} 
                          alt={mvp.ign} 
                          className="player-photo"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/50?text=?'; }}
                        />
                        {/* IGN and Team Name for Mobile Structure */}
                        <span className="player-ign">{mvp.ign}</span>
                        <span className="team-name-mobile">{mvp.teamName}</span>
                      </div>
                    </div>

                    {/* Team (Desktop Only via CSS) */}
                    <div className="mvp-col-team">
                      <span className="team-name">{mvp.teamName}</span>
                    </div>

                    {/* Points (Merged with Actions wrapper in CSS logic visually) */}
                    <div className="mvp-col-points">
                      <span className="mvp-points">{mvp.points} <span style={{fontSize: '0.6rem', color:'#64748b'}}>PTS</span></span>
                      
                      {/* Mobile Actions moved here via CSS logic if needed, or kept separate */}
                      <div className="mvp-col-actions mobile-only-actions" style={{marginTop: '0.5rem'}}>
                         {/* This div is purely for mobile layout adjustment if you want buttons under points */}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mvp-col-actions">
                      <button
                        onClick={() => navigate(`/mvp/edit/${mvp._id || mvp.id}`, { state: { mvp } })}
                        className="btn-icon btn-edit-mvp"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(mvp._id || mvp.id, mvp.ign)}
                        className="btn-icon btn-delete-mvp"
                        title="Delete"
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, mvp: null })}
        onConfirm={confirmDelete}
        type="delete"
        title="Delete MVP Player"
        message={`Are you sure you want to remove "${deleteModal.mvp?.ign}" from the MVP race? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default MVP;