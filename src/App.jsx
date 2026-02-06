import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import MathMaster from './pages/MathMaster';
import ScienceExplorer from './pages/ScienceExplorer';
import EnglishJourney from './pages/EnglishJourney';
import ReadingJourney from './pages/ReadingJourney';
import ArabicAdventure from './pages/ArabicAdventure';
import QuranExplorer from './pages/QuranExplorer';
import MathGame from './pages/MathGame';
import ScienceGame from './pages/ScienceGame';
import LanguageGame from './pages/LanguageGame';
import AyahSorterGame from './pages/AyahSorterGame';
import Planets from './pages/Planets';
import WorldExplorer from './pages/WorldExplorer';
import StatesOfMatter from './pages/StatesOfMatter';
import HumanBody from './pages/HumanBody';
import PlantCycle from './pages/PlantCycle';
import SeasonsWeather from './pages/SeasonsWeather';
import FloatOrSink from './pages/FloatOrSink';


function App() {
  return (
    <Router>
      <div className="app">
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/math" element={<MathMaster />} />
            <Route path="/math/game" element={<MathGame />} />
            <Route path="/science" element={<ScienceExplorer />} />
            <Route path="/science/game" element={<ScienceGame />} />
            <Route path="/science/planets" element={<Planets />} />
            <Route path="/science/world-explorer" element={<WorldExplorer />} />
            <Route path="/science/states-of-matter" element={<StatesOfMatter />} />
            <Route path="/science/human-body" element={<HumanBody />} />
            <Route path="/science/plant-cycle" element={<PlantCycle />} />
            <Route path="/science/seasons-weather" element={<SeasonsWeather />} />
            <Route path="/science/float-sink" element={<FloatOrSink />} />
            <Route path="/english" element={<EnglishJourney />} />
            <Route path="/english/game" element={<LanguageGame />} />
            <Route path="/reading" element={<ReadingJourney />} />
            <Route path="/arabic" element={<ArabicAdventure />} />
            <Route path="/arabic/game" element={<LanguageGame />} />
            <Route path="/quran" element={<QuranExplorer />} />
            <Route path="/quran/sorter" element={<AyahSorterGame />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
