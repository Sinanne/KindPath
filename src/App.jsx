import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import MathMaster from './pages/MathMaster';
import ScienceExplorer from './pages/ScienceExplorer';
import EnglishJourney from './pages/EnglishJourney';
import ReadingJourney from './pages/ReadingJourney';
import ArabicAdventure from './pages/ArabicAdventure';
import QuranExplorer from './pages/QuranExplorer';

function App() {
  return (
    <Router>
      <div className="app">
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/math" element={<MathMaster />} />
            <Route path="/science" element={<ScienceExplorer />} />
            <Route path="/english" element={<EnglishJourney />} />
            <Route path="/reading" element={<ReadingJourney />} />
            <Route path="/arabic" element={<ArabicAdventure />} />
            <Route path="/quran" element={<QuranExplorer />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
