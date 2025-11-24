import React, { useState, useEffect } from 'react';
import { fetchTeams } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './Standings.css';

const Standings = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStandings();
  }, []);

  const loadStandings = async () => {
    try {
      setLoading(true);
      const data = await fetchTeams();
      
      // Sort teams by match points (wins = 1 point each), then by net game win
      const sortedTeams = data.sort((a, b) => {
        const pointsA = a.matchesWon || 0;
        const pointsB = b.matchesWon || 0;
        
        if (pointsB !== pointsA) {
          return pointsB - pointsA; // Sort by points descending
        }
        
        // If points are equal, sort by net game win
        const netGameWinA = (a.gamesWon || 0) - (a.gamesLost || 0);
        const netGameWinB = (b.gamesWon || 0) - (b.gamesLost || 0);
        return netGameWinB - netGameWinA;
      });
      
      setTeams(sortedTeams);
      setError(null);
    } catch (err) {
      setError('Failed to load standings. Please try again later.');
      console.error('Error loading standings:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateMatchPoints = (matchesWon) => {
    return matchesWon || 0;
  };

  const calculateWinRate = (gamesWon, gamesLost) => {
    const total = (gamesWon || 0) + (gamesLost || 0);
    if (total === 0) return '0.0%';
    const rate = ((gamesWon || 0) / total) * 100;
    return `${rate.toFixed(1)}%`;
  };

  const calculateNetGameWin = (gamesWon, gamesLost) => {
    const net = (gamesWon || 0) - (gamesLost || 0);
    return net > 0 ? `+${net}` : net.toString();
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={loadStandings} className="btn-retry">Retry</button>
      </div>
    );
  }

  return (
    <div className="standings-page">
      <div className="page-header">
        <h1 className="page-title">📊 Standings</h1>
        <p className="page-subtitle">MPL Indonesia Season 14 Team Rankings</p>
      </div>

      <div className="standings-container">
        <div className="standings-table">
          <div className="table-header">
            <div className="col-pos">POS</div>
            <div className="col-team">TEAM</div>
            <div className="col-points">MATCH POINT</div>
            <div className="col-record">MATCH W-L</div>
            <div className="col-net">NET GAME WIN</div>
            <div className="col-games">GAME W-L</div>
            <div className="col-winrate">WIN RATE</div>
          </div>

          <div className="table-body">
            {teams.map((team, index) => {
              const matchesWon = team.matchesWon || 0;
              const matchesLost = team.matchesLost || 0;
              const gamesWon = team.gamesWon || 0;
              const gamesLost = team.gamesLost || 0;
              const position = index + 1;
              
              // Determine row class based on position
              let rowClass = 'table-row';
              if (position <= 2) {
                rowClass += ' top-2'; // Playoff spots
              } else if (position >= teams.length - 1) {
                rowClass += ' bottom-2'; // Relegation zone
              }

              return (
                <div key={team._id || team.id} className={rowClass}>
                  <div className="col-pos">
                    <span className="position-badge">
                      {position === 1 && '👑 '}
                      {position === 2 && '⭐ '}
                      {position}.
                    </span>
                  </div>
                  
                  <div className="col-team">
                    <div className="team-info">
                      {team.logo && (
                        <img src={team.logo} alt={team.name} className="team-logo-small" />
                      )}
                      <span className="team-name-standings">{team.name}</span>
                    </div>
                  </div>
                  
                  <div className="col-points">
                    <span className="match-points">{calculateMatchPoints(matchesWon)}</span>
                  </div>
                  
                  <div className="col-record">
                    <span className="match-record">{matchesWon}-{matchesLost}</span>
                  </div>
                  
                  <div className="col-net">
                    <span className={`net-game-win ${(gamesWon - gamesLost) > 0 ? 'positive' : (gamesWon - gamesLost) < 0 ? 'negative' : ''}`}>
                      {calculateNetGameWin(gamesWon, gamesLost)}
                    </span>
                  </div>
                  
                  <div className="col-games">
                    <span className="game-record">{gamesWon}-{gamesLost}</span>
                  </div>
                  
                  <div className="col-winrate">
                    <span className="win-rate">{calculateWinRate(gamesWon, gamesLost)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="standings-legend">
          <div className="legend-item playoff">
            <span className="legend-indicator"></span>
            <span className="legend-text">Playoff Qualification</span>
          </div>
          <div className="legend-item relegation">
            <span className="legend-indicator"></span>
            <span className="legend-text">Relegation Zone</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Standings;
