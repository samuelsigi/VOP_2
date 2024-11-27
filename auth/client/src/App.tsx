import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddOpportunity from './pages/AddOpportunity';
import OpportunityList from './pages/OpportunitiesList';


function App() {
  return (
    
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Signup/>} />
          <Route path="/opportunities-list" element={<OpportunityList />}/>
          <Route path="/opportunities" element={<AddOpportunity/>}/>
        </Routes>
      </Router>
    
    
  );
}

export default App;
