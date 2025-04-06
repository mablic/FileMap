import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './apps/components/nav';
import Home from './apps/home';
import Map from './apps/map';
import Preview from './apps/review/preview';
import Review from './apps/review/review';
import Template from './apps/template';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<Map />} />
          <Route path="/template" element={<Template />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/review" element={<Review />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
