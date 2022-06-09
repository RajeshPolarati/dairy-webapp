import './App.css';
import Main from "./Components/Main"
import Home from "./Components/Home"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Credentials from "./Components/credentials"
import Image from "./Components/Image"
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/home" element={<Home selected="home" />} />
          <Route path="/credentials" element={<Credentials selected="credentials" />} />
          <Route path="/img" element={<Image />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
