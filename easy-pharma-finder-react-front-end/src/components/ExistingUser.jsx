import { useState, useEffect } from 'react';
import Footer from './Footer';
import { Country, State } from 'country-state-city';
import ReusableButton from './ReusableButton';
import './css/existing-user.css';


//Display the profile details when the existing user logged-in.
const ExistingUser = ({userLogged}) => { //logged username passes as a props from App.jsx

    const [userProfile, setUserProfile] = useState(null); //store the existing user details.
    const [isEdit, setIsEdit] = useState(false); //check if the page is in edit mode.
    const [editProfile, setEditProfile] = useState(null); //Save the updated user details when changes are made.
    const [message, setMessage] = useState(""); //Display the message if the user click "Save"
    const [warningMessage , setWarningMessage] = useState("");//Display the message if the user click "Remove family members"
   

    //create state variable for country, state and get the values from the package "country-state-city"
    const[countries, setCountries] = useState(Country.getAllCountries());
    const[states, setStates] = useState([]);
    const[selectedCountry, setSelectedCountry] = useState(null); // create state variable to store the user selected country.

    //fetch() run when the userLogged changes, and get the existing user details based on the username
    useEffect(() => {
        
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/user/username?userName=${userLogged}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include', // Include credentials to access the session
                });
                //Display the error messsage if response is not found
                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }

                const data = await response.json();
                data.password=null;
                setUserProfile(data);
            
            } 
            //Catch any errors thrown from the try block and log errors for debugging purposes.
            catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };
        fetchUserProfile();
    }, [userLogged]);

    //Made the state value unchanged if the user changes the country and stored the updated value into editProfile.
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'country') {
            const selectedCountry = countries.find(country => country.name === value);
          
                setSelectedCountry(selectedCountry);
                setStates(State.getStatesOfCountry(selectedCountry.isoCode));
           
        // Update the editProfile state with the new value
            setEditProfile((currentVal) => ({
                ...currentVal,
                [name]: value, state: '', // Reset state when country changes
            }));
        }   
        else { 
            setEditProfile((currentVal) => ({
                ...currentVal,[name]:value,
                }));
        }      
    }

    //If family member details changes, store the updated values(name, dob, relationship, index) into an array of objects.
    const handleFamilyMemberChange = (e, index, name) => {
        const { value } = e.target;
        setEditProfile((currentVal) => {
            const updatedFamilyMembers = [...currentVal.familyMembers];
            updatedFamilyMembers[index][name] = value; // Update the specific field of the family member
            return {
                ...currentVal,
                familyMembers: updatedFamilyMembers
            };
        });
    };

    //If the user clicks the edit button, display all the user details except the password
    const handleEdit = () => {
        setIsEdit(true);
        setMessage("")
        setEditProfile({...userProfile,
                        password:""
                        
        });
        
    //Display the user selected country and the corressponding selected state
        const country = countries.find(country => country.name === userProfile.country);
        if (country) {
            setSelectedCountry(country);
            setStates(State.getStatesOfCountry(country.isoCode));
        }        
    }

    //verify whether the checkbox is checked or not and add the checkbox checked status in the editMember variable.
    const handleCheckboxChange = (e, index) => {
        const { checked } = e.target;
        setEditProfile((currentVal) => {
            const updatedFamilyMembers = [...currentVal.familyMembers];
            updatedFamilyMembers[index].isChecked = checked; // Update the isChecked property
            return {
                ...currentVal,
                familyMembers: updatedFamilyMembers,
            };
        });
    };

    //Add the new family members(if any) in the edit profile.
    const handleAddFamilyMember = () => {
        setWarningMessage(null);
        setEditProfile((currentVal) => ({
            ...currentVal,
            familyMembers: [
                ...currentVal.familyMembers,
                { name: '', dob: '', relationship: '', isChecked: false }   // Add a new family member with default values          
            ],
        }));  
    };

    //Remove the selected family memebr from the backend using "DELETE" 
    const handleRemoveFamilyMember = async () => {
        setWarningMessage(null);
        const updatedFamilyMembers = editProfile.familyMembers.filter(member => !member.isChecked); //store the family mmebers which are not selected
        const removedFamilyMembers = editProfile.familyMembers.filter(member => member.isChecked); //store the family mmebers which are selected to remove
        const removedID = removedFamilyMembers.filter(member => member.id != undefined) //Get the id of member which is already in the backend.
                                            .map(member => member.id); //Get the id of the selected family members
       
                                            
        //set a validation that primary user not to be deleted
        const primaryMembers = editProfile.familyMembers.filter(member => member.relationship === "Self" && member.isChecked);
       
        if (primaryMembers.length >0 ) {
            setWarningMessage("You are not allowed to delete the primary user in the family member list.");
            return;
        }

        if(removedFamilyMembers.length == 0) setWarningMessage("Please select at least one family member to remove.");

        //Pass the removed family members id to backend and store the updated values in editprofile variable.
        try {
            if (removedID.length > 0 ) {
                const response = await fetch(`http://localhost:8080/api/user/deleteFamilyMember`, {
                    method:'DELETE',
                    headers:{'Content-Type':'application/json'},
                    credentials: 'include', // Include credentials to access the session
                    body:JSON.stringify(removedID),
                });
            if (!response.ok) {
                throw new Error('Failed to remove family members');
            }
        }
        //store the updated family members into the editProfile variable.
            setEditProfile((currentVal) => ({
                ...currentVal,
                familyMembers: updatedFamilyMembers  
            }));
        }
        //Catch any errors thrown from the try block and log errors for debugging purposes.
        catch(error) {
            console.error("Debugging Information:" ,error);
            return;
        }          
    };

    //Save the update values into the backend using "PUT" method
    const handleSaveButton = async () => {
        setWarningMessage(null);
        const pwdPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        //validate the changed password pattern
        if(editProfile.password && !pwdPattern.test(editProfile.password)) {
            setMessage("Password must be at least 8 characters, include uppercase letter, number, and special character.");
            return;
          }
        
        try {
            const response = await fetch(`http://localhost:8080/api/user/updateUser`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Include credentials to access the session
                body: JSON.stringify(editProfile),
            });

            if (!response.ok) { //throw error if no response.
                throw new Error('Failed to update user profile');
            }

            const data = await response.json();
            setUserProfile(data);           
            setIsEdit(false);
            setEditProfile({...data,
                            password:""
            }); // Update the editProfile state with the response data from the backend

            setMessage("Profile updated successfully.");
        } 
        
        //Catch any errors thrown from the try block and log errors for debugging purposes.
        catch (error) {
            console.error('Error updating user profile:', error);
        }
    };

    //Return a loading message DOM element while the user profile is being fetched from the backend.
    if (!userProfile) {
        return <div>Loading...</div>;
    }   

    // JSX below is fully controlled by React — any UI updates are handled through useState
    return(
        <form onSubmit = {handleSaveButton}>
            <div className="container">

                {/* Display messages using conditional rendering controlled by React state */}
                <div className="content">
                    <div className="message-div">
                        {message && <p className="message-update">{message}</p>}
                    </div>  

                    {/* Profile form content - follows proper HTML structure using semantic elements */}
                    <div className="profile">
                        <h2 className="h2-animation">Profile Details</h2>

                        <div>
                            <label> First Name *</label>
                            {isEdit ?
                                (<input type="text" name="firstName" value={editProfile.firstName || ""} onChange={handleChange} required/>)
                                : 
                                <span>{userProfile.firstName}</span>
                            } 
                        </div>

                        <div>
                            <label> Middle Name </label>
                            {isEdit ?
                                (<input type="text" name="middleName" value={editProfile.middleName || ""} onChange={handleChange} />)
                                : 
                                <span>{userProfile.middleName}</span>
                            }  
                        </div>   

                        <div> 
                            <label> Last Name *</label>
                            {isEdit ?
                                (<input type="lastName" name="lastName" value={editProfile.lastName || ""} onChange={handleChange} required/>)
                                : 
                                <span>{userProfile.lastName}</span>
                            }
                        </div> 

                        <div>
                            <label>DOB *</label>
                            {isEdit ?
                                (<input type="date" name="dob" value={editProfile.dob || ""} onChange={handleChange} required/>)
                                : 
                                <span>{userProfile.dob}</span>
                            }   
                        </div>

                        <div>
                            <label>Username </label>
                            <span>{userProfile.userName}</span>     
                        </div>

                        <div>
                            <label>Password </label>
                            {isEdit ?
                                (<input type="password" name="password" value={editProfile.password || ""} autoComplete="off" onChange={handleChange} pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$" 
                                    title="Password must be at least 8 characters, include an uppercase letter, a number, and a special character."  />)
                                : 
                                <span>**********</span>
                            }   
                        </div>

                        <div>
                            <label> Email </label>
                            {isEdit ?
                                (<input type="email" name="email" value={editProfile.email || ""} onChange={handleChange} />)
                                : 
                                <span>{userProfile.email}</span>
                            }   
                        </div>

                        <div>
                            <label> Contact Number </label>
                            {isEdit ?
                                (<input type="tel" name="contactNo" value={editProfile.contactNo || ""} onChange={handleChange} />)
                                : 
                                <span>{userProfile.contactNo}</span>
                            }   
                        </div>

                        <div>
                            <fieldset className="location-container">
                                <legend className="address">Address </legend>
                                <div>
                                    <label>Street name *</label>
                                    {isEdit ?
                                        (<input type="text" name="street" value={editProfile.street || ""} onChange={handleChange} required/>)
                                        : 
                                        <span>{userProfile.street}</span>
                                    }
                                </div>

                                <div>
                                    <label>City *</label>
                                    {isEdit ?
                                        (<input type="text" name="city" value={editProfile.city || ""} onChange={handleChange} required/>)
                                        : 
                                        <span>{userProfile.city}</span>
                                    }
                                </div>

                                <div>
                                    <label>State *</label>
                                    {isEdit ?
                                        (<select className="dropdown" name="state" value={editProfile.state || ""} onChange={handleChange} required>
                                            <option value="">Select State</option>
                                            {states.map(state => (
                                                <option key={state.isoCode} value={state.name}>{state.name}</option>
                                            ))}
                                        </select>)
                                        : 
                                        <span>{userProfile.state}</span>
                                    }
                                </div>

                                <div>
                                <label>Country *</label>
                                    {isEdit ?
                                        (<select className="dropdown" name="country" value={editProfile.country || ""} onChange={handleChange} required>
                                            <option value="">Select Country</option>
                                            {countries.map(country => (
                                                <option key={country.isoCode} value={country.name}>{country.name}</option>
                                            ))}
                                        </select>)
                                        : 
                                        <span>{userProfile.country}</span>
                                    }
                                </div>

                                <div>
                                    <label>Zip Code *</label>
                                    {isEdit ?
                                        (<input type="text" name="zipCode" value={editProfile.zipCode || ""} onChange={handleChange} required/>)
                                        : 
                                        <span>{userProfile.zipCode}</span>
                                    }   
                                </div>
                            </fieldset>
                        </div>

                        <div> 
                            <label>Insurance Provider *</label>  
                            {isEdit ?
                            (<select className="dropdown" name="insuranceProvider" value={editProfile.insuranceProvider || ""} onChange={handleChange} required>
                                    <option value="">Select Insurance Provider</option>
                                    <option value="Aetna">Aetna</option>
                                    <option value="Blue Cross Blue Shield">Blue Cross Blue Shield</option>
                                </select>)
                                : 
                                <span>{userProfile.insuranceProvider}</span>
                            }       
                        </div>

                        <div>
                            <label>Insurance Number *</label>  
                            {isEdit ?
                                (<input type="text" name="insuranceNumber" value={editProfile.insuranceNumber || ""} onChange={handleChange} required/>)
                                : 
                                <span>{userProfile.insuranceNumber}</span>
                            }   
                        </div>

                        <div>
                            <label>Insurance Type *</label>  
                            {isEdit ? (
                                <div>
                                    <label>
                                        <input type="radio" name="insuranceType" value="HMO" checked = {editProfile.insuranceType === "HMO"} onChange={handleChange} required/> HMO
                                    </label>
                                    <label>
                                        <input type="radio" name="insuranceType" value="PPO" checked = {editProfile.insuranceType === "PPO"} onChange={handleChange} required/> PPO
                                    </label>
                                </div>
                            ): 
                                (<span>{userProfile.insuranceType}</span>)
                            }
                        </div>

                    
                        <h3>Family Members</h3>
                        {!isEdit ? 
                                (
                                    userProfile.familyMembers && userProfile.familyMembers.length > 0 ? 
                                    (
                                        <div className="table-container">
                                            <table className="family-members">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>DOB</th>
                                                        <th>Relationship</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {userProfile.familyMembers.map((member, index) => (
                                                        <tr key={index}>
                                                            <td>{member.name}</td><td>{member.dob}</td><td>{member.relationship}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )
                                    : 

                                    (<div>
                                        (No family members added.)
                                    </div>)   
                                ) 

                                :
                                (editProfile.familyMembers && editProfile.familyMembers.length > 0 ? (
                                    <div className="table-container">
                                    <table className="family-members">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Name</th>
                                                <th>DOB</th>
                                                <th>Relationship</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {editProfile.familyMembers.map((member, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <input type="checkbox" checked={member.isChecked} onChange={(e) => handleCheckboxChange(e, index)} />
                                                    </td>
                                                    <td>
                                                        <input type="text" value={member.name} onChange={(e) => handleFamilyMemberChange(e, index, 'name')} />
                                                    </td>
                                                    <td>
                                                        <input className="dob-input" type="date" value={member.dob} onChange={(e) => handleFamilyMemberChange(e, index, 'dob')} />
                                                    </td>
                                                    <td>
                                                        <select className="relation-select" value={member.relationship} onChange={(e) => handleFamilyMemberChange(e, index, 'relationship')}>
                                                            <option value=''>Select Relationship</option>
                                                            <option value='Self'>Self</option>
                                                            <option value='Spouse'>Spouse</option>
                                                            <option value='Child'>Child</option>
                                                            <option value='Parent'>Parent</option>
                                                            <option value='Sibling'>Sibling</option>
                                                            <option value='Other'>Other</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>

                                    </table>
                                    </div>
                                    )
                                :
                                    (<div>
                                        (No family members added.)
                                    </div>))         
                        }   
                    </div>
                    
                    <div className="btn-container">         
                        {isEdit ? (
                            <>
                                <div>
                                    {warningMessage && <p className='error'>{warningMessage}</p>}
                                </div>
                                
                                <ReusableButton className="btn-edit" type = "button" id="remove_family_member" name = "remove_family_member" onClick={handleRemoveFamilyMember}>Remove Family Member
                                </ReusableButton>

                                <ReusableButton className="btn-edit" type ="button" id="add_family_member" name = "add_family_member" onClick={handleAddFamilyMember}>Add Family Member</ReusableButton>
                                <ReusableButton className="btn-edit" id="save" name = "save" type="button" onClick={handleSaveButton}>Save</ReusableButton> 

                                <ReusableButton className="btn-edit" id="cancel" name = "cancel" onClick={() => { setIsEdit(false)
                                                                                            setWarningMessage(null);
                                                                                            setEditProfile({
                                                                                                ...userProfile,
                                                                                                familyMembers: userProfile.familyMembers?.map(m => ({ ...m, isChecked: false }))
                                                                                                });
                                                                                            }
                                                                                    }
                                >Cancel</ReusableButton>
                            </>
                        ) :
                            <ReusableButton className="btn-edit" id="edit" name = "edit" onClick={handleEdit}>Edit</ReusableButton>
                        }          
                    </div>

                </div>
                <Footer />
            </div>
        </form>
    )
}

export default ExistingUser;
