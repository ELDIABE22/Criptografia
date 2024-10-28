import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './page/Home';
import Cryptography from './page/Cryptography';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cryptography" element={<Cryptography />} />
      </Routes>
    </Router>
  );
}

export default App;
