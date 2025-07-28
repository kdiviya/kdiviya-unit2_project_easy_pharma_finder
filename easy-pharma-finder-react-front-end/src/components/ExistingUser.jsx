import { useLocation,useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import ReusableButton from './ReusableButton';
import './css/existing-user.css';

//Display the profile details when the existing user logged-in.
const ExistingUser = () => {
    
    const [familyMembers, setFamilyMembers] = useState([]);
    //create a variable for useNavigate and useLocation
    const navigate = useNavigate();
    const location = useLocation();
    const user  = location.state.userName; //Assign the logged user details which is passed from "LoginInfo.jsx" to "user".


    useEffect(() => { 
        const fetchFamilyMembers = async () => { 
       
            try {
                const response = await fetch(`http://localhost:8080/api/user/existingUser/${user}/family-members`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                   
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
                const data = await response.json();
                setFamilyMembers(data);
                
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        
        };

        if(user) fetchFamilyMembers();
    }, []);
   

    return(
        <div className="container">
            <Header />
            <div className="content">
                
                <div className="profile">
                    <h2 className="h2-animation">Medication</h2>
                    <ul>
                        {[...familyMembers]
                        .sort((a,b) => (a.relationship === "self"? -1 : 1)) // Sort so that self is always first
                        .map(member => {
                            return <li key = {member.id}
                                className="family-member">
                                <p>{member.relationship === "self"? `Primary User - ${member.name}`: `${member.name}`}</p>
                            </li> }
                        )}
                               
                    </ul>
                </div>

            </div>
            <Footer />
        </div>
    )
}

export default ExistingUser;
