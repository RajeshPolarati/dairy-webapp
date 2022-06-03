import './App.css';
import Main from "./Components/Main"
import Home from "./Components/Home"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Credentials from "./Components/credentials"
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/home" element={<Home selected="home" />} />
          <Route path="/credentials" element={<Credentials selected="credentials" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
