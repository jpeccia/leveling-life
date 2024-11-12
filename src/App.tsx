import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Adicione as demais rotas conforme necessário */}
      </Routes>
    </Router>
  );
}

export default App;