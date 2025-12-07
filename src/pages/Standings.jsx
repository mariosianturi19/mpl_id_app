import React, { useState, useEffect } from 'react';
import { fetchTeams } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/pages/Standings.css';

const Standings = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStandings();
  }, []);

  const loadStandings = async () => {
    console.log('📊 Loading standings...');
    try {
      setLoading(true);
      const data = await fetchTeams();
      console.log('✅ Standings loaded successfully:', data);
      
      // Sort: Points (Match Won) > Net Game Win
      const sortedTeams = data.sort((a, b) => {
        const pointsA = (a.matchesWon || 0); // Di MPL ID biasanya Match Won = 1 poin
        const pointsB = (b.matchesWon || 0);
        
        if (pointsB !== pointsA) return pointsB - pointsA;
        
        const netA = (a.gamesWon || 0) - (a.gamesLost || 0);
        const netB = (b.gamesWon || 0) - (b.gamesLost || 0);
        return netB - netA;
      });
      
      setTeams(sortedTeams);
      setError(null);
    } catch (err) {
      console.error('❌ Failed to load standings:', err);
      setError('Failed to load standings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const calculateWinRate = (won, lost) => {
    const total = (won || 0) + (lost || 0);
    if (total === 0) return '0%';
    return `${((won / total) * 100).toFixed(0)}%`;
  };

  const getNetGameWin = (won, lost) => {
    return (won || 0) - (lost || 0);
  };

  const getZoneClass = (index) => {
    if (index <= 5) return 'zone-playoff'; // Rank 1-6 (Lolos Playoff)
    return 'zone-eliminated'; // Rank 7+ (Tidak Lolos)
  };

  const getRankClass = (index) => {
    if (index === 0) return 'rank-1';
    if (index === 1) return 'rank-2';
    if (index === 2) return 'rank-3';
    return '';
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
        <h1 className="page-title">Season Standings</h1>
        <p className="page-subtitle">Regular Season 16 Leaderboard</p>
      </div>

      <div className="standings-container">
        <div className="standings-table">
          {/* Header */}
          <div className="table-header">
            <div className="header-cell">Rank</div>
            <div className="header-cell text-left">Team</div>
            <div className="header-cell">Points</div>
            <div className="header-cell">Match</div>
            <div className="header-cell">Net Game</div>
            <div className="header-cell">Game W-L</div>
            <div className="header-cell">Win Rate</div>
          </div>

          {/* Body */}
          <div className="table-body">
            {teams.map((team, index) => {
              const netGame = getNetGameWin(team.gamesWon, team.gamesLost);
              const rank = index + 1;
              const zoneClass = getZoneClass(index);
              const rankClass = getRankClass(index);

              return (
                <div key={team._id || team.id} className={`table-row ${zoneClass} ${rankClass}`}>
                  {/* Rank */}
                  <div className="col-rank">
                    <span className="rank-badge">{rank}</span>
                  </div>

                  {/* Team */}
                  <div className="col-team">
                    {team.logo && (
                      <img src={team.logo} alt={team.name} className="team-logo-mini" />
                    )}
                    <span className="team-name">{team.name}</span>
                  </div>

                  {/* Points (Match Won) */}
                  <div className="col-stat">
                    <span className="stat-highlight">{team.matchesWon || 0}</span>
                  </div>

                  {/* Match Record */}
                  <div className="col-stat">
                    {team.matchesWon || 0} - {team.matchesLost || 0}
                  </div>

                  {/* Net Game Win */}
                  <div className="col-stat">
                    <span className={`net-badge ${netGame > 0 ? 'positive' : netGame < 0 ? 'negative' : 'neutral'}`}>
                      {netGame > 0 ? `+${netGame}` : netGame}
                    </span>
                  </div>

                  {/* Game Record */}
                  <div className="col-stat">
                    {team.gamesWon || 0} - {team.gamesLost || 0}
                  </div>

                  {/* Win Rate */}
                  <div className="col-stat">
                    <span className="win-rate">
                      {calculateWinRate(team.gamesWon, team.gamesLost)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="standings-legend">
          <div className="legend-item">
            <span className="legend-dot dot-playoff"></span>
            <span className="legend-text">Lolos Playoff (Rank 1-6)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-eliminated"></span>
            <span className="legend-text">Tidak Lolos (Rank 7+)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Standings;