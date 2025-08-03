import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import About from './components/About';
import Introduction from './components/Introduction';
import NewUser from './components/NewUser';
import PharmacyFinder from './components/PharmacyFinder';
import LoginInfo from './components/LoginInfo';
import Header from './components/Header';
import ExistingUser from './components/ExistingUser';
import Feedback from './components/Feedback';
import { useState } from 'react';
import Logout from './components/Logout';
import './App.css';
import FamilyMember from './components/FamilyMember';

function App() {

  const [userLogged, setUserLogged] = useState(() => {
    return localStorage.getItem("userName") || null;
  }
    );

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

        <Route path = "/pharma-finder" element={<PharmacyFinder />}
        />

        <Route path = "/login" element={<LoginInfo setUserLogged = {setUserLogged} />}
        />

        <Route path = "/existing-user" element={<ExistingUser userLogged = {userLogged} />}
        />

        <Route path = "/family-members/:userName" element={<FamilyMember />}
        /> 

        <Route path = "/logout" element={<Logout setUserLogged = {setUserLogged}/>}
        />   

        <Route path = "/feedback" element={<Feedback />}
        />  

      </Routes>
    </Router>
  )
}

export default App;
