import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Teams from './pages/Teams';
import CreateTeam from './pages/CreateTeam';
import TeamDetail from './pages/TeamDetail';
import Standings from './pages/Standings';
import MVP from './pages/MVP';
import CreateMVP from './pages/CreateMVP';
import EditMVP from './pages/EditMVP';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Teams />} />
          <Route path="create" element={<CreateTeam />} />
          <Route path="team/:id" element={<TeamDetail />} />
          <Route path="standings" element={<Standings />} />
          <Route path="mvp" element={<MVP />} />
          <Route path="mvp/create" element={<CreateMVP />} />
          <Route path="mvp/edit/:id" element={<EditMVP />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
