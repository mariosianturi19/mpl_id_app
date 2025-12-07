import React from 'react';
import '../styles/pages/Profile.css';

const Profile = () => {
  // Static data for now
  const user = {
    name: 'Robby Ferliansyah Bahar',
    role: 'League Administrator',
    email: 'admin@mpl-id.com',
    joinDate: 'January 2024',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=4fc3f7&color=fff&size=200',
    stats: {
      teamsManaged: 9,
      seasonsActive: 4,
      lastLogin: 'Today, 10:23 AM'
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar-wrapper">
          <img src={user.avatar} alt={user.name} className="profile-avatar" />
        </div>
        <div className="profile-info">
          <h1>{user.name}</h1>
          <span className="profile-role">{user.role}</span>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h3 className="section-title">Personal Information</h3>
          
          <div className="info-group">
            <span className="info-label">Email Address</span>
            <span className="info-value">{user.email}</span>
          </div>
          
          <div className="info-group">
            <span className="info-label">Member Since</span>
            <span className="info-value">{user.joinDate}</span>
          </div>

          <div className="info-group">
            <span className="info-label">Last Active</span>
            <span className="info-value">{user.stats.lastLogin}</span>
          </div>
        </div>

        <div className="profile-section">
          <h3 className="section-title">Activity Stats</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">{user.stats.teamsManaged}</span>
              <span className="stat-label">Teams Managed</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{user.stats.seasonsActive}</span>
              <span className="stat-label">Seasons Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
