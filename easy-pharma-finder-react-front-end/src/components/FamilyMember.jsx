import { Link} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Footer from './Footer';
import './css/family-member.css';

//Display the profile details when the existing user logged-in.
const FamilyMember = () => {

    const { userName } = useParams(); // Get the userName from the URL parameters
    const [familyMembers, setFamilyMembers] = useState([]);
    //Assign the logged user details which is passed from "LoginInfo.jsx" to "user".

    useEffect(() => { 
        const fetchFamilyMembers = async () => { 
       
            try {
                const response = await fetch(`http://localhost:8080/api/user/existingUser/${userName}/family-members`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                   
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

        if(userName) fetchFamilyMembers();
    }, [userName]);
   

    return(
        <div className="container">
           
            <div className="content">
                
                <div className="profile">
                    <h3 className="h2-animation">Hello {familyMembers.find(members => members.relationship === "Self") ?.name}, Welcome to Easy Pharma Finder!!!</h3>
                    <p>Below are the user/s associated with your account. Please click the below link to view their medication.</p>
                    <ul className = "family_member">
                        {[...familyMembers]
                        .sort((a,b) => (a.relationship === "Self"? -1 : 1)) // Sort so that self is always first
                        .map(member => {
                         
                            return (
                            <Link to = {"/pharma-finder"} state = {{memberId:member.id, userName:userName}} key= {member.id} className='family-member-link'>
                                <li key = {member.id} className="family-member">
                                    {member.relationship === "Self"? `${member.name} (Primary user)`: `${member.name}`}
                                </li>
                            </Link>); }
                        )}
                               
                    </ul>
                </div>

            </div>
            <Footer />
        </div>
    )
}

export default FamilyMember;
