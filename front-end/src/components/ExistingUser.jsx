import { useLocation,useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import ReusableButton from './ReusableButton';
import './css/existing-user.css';

//Display the profile details when the existing user logged-in.
const ExistingUser = () => {
    
    //create a variable for useNavigate and useLocation
    const navigate = useNavigate();
    const location = useLocation();
    const user  = location.state.foundUser; //Assign the logged user details whic is passed from "LoginInfo.jsx" to "user".
    let name = `${user.firstName} ${user.middleName} ${user.lastName}`;
    
    //Verify the logged user authentication
    if(!user) {
        return <p>Incorrect Incredentials. Please try again!!!</p>;
    }

    //create state variable for to store the logged user details.
    const[loggedUser, setLoggedUser] = useState(user);

    //create state variable for displayning Edit/Save button
    const [isEdit, setIsEdit] = useState(false);
    
    //if the user edit the address or contact number, the value is updated to loggedUser state variable.
    const handleChange = (e) => {
        const { name, value } = e.target;

        //Assign the updated value(street, city, zipcode) to the loggedUser.address[]
        if(['street', 'city', 'zipCode'].includes(name)) {
            setLoggedUser((currentVal) => ({
                ...currentVal,
                address : {
                    ...currentVal.address,
                    [name]:value,
                },
               
            }));
        }

        //Assign the updated contact number to loggedUser
        else {
            setLoggedUser((currentVal) => ({
                ...currentVal,
                [name]:value,
    
            }));
        }
    }

    return(
        <div className="container">
            <Header />
            <div className="content">
                
                <div className="profile">
                    <h2 className="h2-animation">Profile Details</h2>
                    <p>Name:<span>{name}</span></p>
                    <p>Insurance Number:<span>{loggedUser.insuranceNo}</span></p>
                    <p>Insurance Type:<span>{loggedUser.insuranceType}</span></p>
                    <p>Hospital Visted Date:<span>{loggedUser.lastVistedDate}</span></p>

                    {   isEdit ? 
                            <div className="edit-details">
                                <label>Contact Number:</label>
                                <span><input name="contactNo" value={loggedUser.contactNo} onChange={handleChange} /></span>

                                <label>Street Name:</label>
                                <span><input name="street"  value={loggedUser.address.street} onChange={handleChange}/></span>

                                <label>City:</label>
                                <span><input name="city"  value={loggedUser.address.city} onChange={handleChange} /></span>

                                <label>Zipcode:</label>
                                <span><input name="zipCode"  value={loggedUser.address.zipCode} onChange={handleChange} /></span>

                                <ReusableButton id="save-button" type="button" onClick={() => setIsEdit(false)}>Save Details</ReusableButton>
                            </div>
                        :
                        <>
                            <p>Contact Number:<span>{loggedUser.contactNo}</span></p>
                            <p>Address:<span>{loggedUser.address.street}, {loggedUser.address.city} - {loggedUser.address.zipCode}</span></p>
                            <div className="edit-view-button">
                                <ReusableButton id="edit-button" type="button" onClick={() => setIsEdit(true)}>Edit Details</ReusableButton>
                                <ReusableButton id= "view-button" type ="button" onClick = { 
                                                                                 () => (navigate('/pharma-finder', {state:{loggedUser}}))
                                                                                }
                                >Pharmacy Finder
                                </ReusableButton>
                            </div>
                        </>
                    }
                </div>

            </div>
            <Footer />
        </div>
    )
}

export default ExistingUser;
