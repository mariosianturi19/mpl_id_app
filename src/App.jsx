



import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';

// Pages Import
import Teams from './pages/Teams';
import TeamsRoster from './pages/TeamsRoster'; // List teams dengan full roster
import CreateTeam from './pages/CreateTeam';
import TeamDetail from './pages/TeamDetail'; // Halaman Edit
import TeamView from './pages/TeamView';     // Halaman View Detail
import Standings from './pages/Standings';
import MVP from './pages/MVP';
import CreateMVP from './pages/CreateMVP';
import EditMVP from './pages/EditMVP';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Halaman Utama (View Teams Roster) */}
          <Route index element={<TeamsRoster />} />
          
          {/* Halaman Edit Teams */}
          <Route path="teams" element={<Teams />} />
          
          {/* Halaman Create */}
          <Route path="create" element={<CreateTeam />} />
          
          {/* PENTING: Routing Tim */}
          {/* Halaman View (Read Only) - Diakses via klik kartu di halaman Teams */}
          <Route path="team/:id" element={<TeamView />} />
          
          {/* Halaman Edit - Diakses via tombol edit */}
          <Route path="team/edit/:id" element={<TeamDetail />} />
          
          {/* Standings & MVP */}
          <Route path="standings" element={<Standings />} />
          <Route path="mvp" element={<MVP />} />
          <Route path="mvp/create" element={<CreateMVP />} />
          <Route path="mvp/edit/:id" element={<EditMVP />} />
          <Route path="profile" element={<Profile />} />
          
          {/* Profile */}
          <Route path="profile" element={<Profile />} />
          
          {/* Fallback 404 */}
          <Route path="*" element={<div style={{color:'white', textAlign:'center', padding:'5rem'}}>404 - Page Not Found</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;