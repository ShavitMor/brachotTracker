import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import BlessingListPage from './components/BlessingListPage';
import BlessPage from './components/BlessPage';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);

  return (
    <Router>
      <Navbar /> {/* Navbar is displayed on every page */}

      <Routes>
        {/* Main page where the user selects their user */}
        <Route path="/" element={<MainPage onSelectUser={setUserId} />} />
        
        {/* Page showing the list of blessings for the selected user */}
        <Route
          path="/blessing-list/:userId"
          element={userId ? <BlessingListPage /> : <p>Please select a user first.</p>}
        />
        
        {/* Page showing a specific blessing, fetched from Firebase */}
        <Route path="/bless/:userId/:blessing" element={<BlessPage />} />
      </Routes>
    </Router>
  );
};

export default App;
