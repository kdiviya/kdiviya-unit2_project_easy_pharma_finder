import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import pharmacyData from './sample-data/pharmacyData.json';
import About from './components/About';
import Introduction from './components/Introduction';
import NewUser from './components/NewUser';
import PharmacyFinder from './components/PharmacyFinder';
import LoginInfo from './components/LoginInfo';
import Header from './components/Header';
import { useState } from 'react';
import Logout from './components/Logout';
import './App.css';
import FamilyMember from './components/FamilyMember';

function App() {

  const [userLogged, setUserLogged] = useState("");

  return (
    <Router>

      <Header userLogged={userLogged} />

      <Routes>
        
        <Route path= "/" element={<Introduction />}
        />

        <Route path= "/about" element={<About />}
        />

        <Route path = "/new-user" element={<NewUser />}
        />

        <Route path = "/pharma-finder" element={<PharmacyFinder  pharmacyData={pharmacyData}/>}
        />

        <Route path = "/login" element={<LoginInfo setUserLogged = {setUserLogged} />}
        />

        <Route path = "/family-members" element={<FamilyMember />}
        /> 

        <Route path = "/logout" element={<Logout />}
        />   

      </Routes>
    </Router>
  )
}

export default App;
