import { Link} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Footer from './Footer';
import './css/family-member.css';

//Display the family members list as a link assoicated with that existing user.
const FamilyMember = () => {

    const { userName } = useParams(); // Get the userName from the URL parameters
    const [familyMembers, setFamilyMembers] = useState([]); //to store the family member details from the backend.
    const [message, setMessage] =  useState("");
    
    //Fetch the family member details using "GET()" from the backend whenever the username changes
    useEffect(() => { 
        const fetchFamilyMembers = async () => { 
       
            try {
                const response = await fetch(`http://localhost:8080/api/user/existingUser/${userName}/family-members`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                   
                });
                //Display the error messsage if response is not found
                if (!response.ok) {
                    if (response.status === 404) {
                        setMessage({ status: 'error', message: 'User not found. Please check the username.' });
                    } else if (response.status === 500) {
                        setMessage({ status: 'error', message: 'Server error. Please try again later.' });
                    } else {
                        setMessage({ status: 'error', message: 'Failed to fetch family members. Please try again.' });
                    }
                }
                const data = await response.json(); 

                if (data.results && data.results.length > 0) {
                    setFamilyMembers(data.results); //store the json response into familyMembers state variable
                } 
                else {
                    setMessage(data.info || 'No medications found.');
                }
                        
            } 

            //Catch any errors from the try block and log errors for debugging purposes.
            catch (error) {
                console.error("Error fetching user data:", error);
                setMessage({ status: 'error', message: 'An unexpected error occurred. Please try again.' });
            }       
        };

        if(userName) fetchFamilyMembers(); //call the function when the userName is available.
    }, [userName]);
   
// Below JSX is fully controlled by React — any UI updates are handled through useState dynamically.
    return(
        <div className="container">
           
            <div className="content">
                
                <div className="profile">
                    <h3 className="h2-animation">Hello {familyMembers.find(members => members.relationship === "Self") ?.name}, Welcome to Easy Pharma Finder!!!</h3>
                    <p>Below are the user/s associated with your account. Please click the below link to view their medication.</p>
                     {/* Display message if there's an error or no data */}
                     {message && (
                        <div className="message">
                            {message.message}   
                        </div>
                    )}
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
