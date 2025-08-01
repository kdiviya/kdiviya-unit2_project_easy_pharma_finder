import { useState, useEffect, use } from 'react';
import Footer from './Footer';
import { Country, State } from 'country-state-city';
import ReusableButton from './ReusableButton';
import './css/existing-user.css';


//Display the profile details when the existing user logged-in.
const ExistingUser = ({userLogged}) => {
    const [userProfile, setUserProfile] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [editProfile, setEditProfile] = useState(null);
    const [message, setMessage] = useState("");
    const [warningMessage , setWarningMessage] = useState("");
   

    //create state variable for country, state and get the values from the package "country-state-city"
    const[countries, setCountries] = useState(Country.getAllCountries());
    const[states, setStates] = useState([]);
    const[selectedCountry, setSelectedCountry] = useState(null); // create state variable to store the user selected country.

    useEffect(() => {
        //Fetch the user profile details from the server.
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/user/username?userName=${userLogged}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include', // Include credentials to access the session
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }
                const data = await response.json();
                data.password=null;

                setUserProfile(data);
            
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };
        fetchUserProfile();
    }, []);


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

    const handleEdit = () => {
        setIsEdit(true);
        setMessage("")
        setEditProfile({...userProfile,
                        password:""
                        
        });
       

        const country = countries.find(country => country.name === userProfile.country);
        if (country) {
            setSelectedCountry(country);
            setStates(State.getStatesOfCountry(country.isoCode));
        } 
        
    }

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

    const handleAddFamilyMember = () => {
        setEditProfile((currentVal) => ({
            ...currentVal,
            familyMembers: [
                ...currentVal.familyMembers,
                { name: '', dob: '', relationship: '', isChecked: false }   // Add a new family member with default values          
            ],
        }));  
    };

    const handleRemoveFamilyMember = async () => {
        const updatedFamilyMembers = editProfile.familyMembers.filter(member => !member.isChecked);
        const removedFamilyMembers = editProfile.familyMembers.filter(member => member.isChecked);
        const removedID = removedFamilyMembers.map(member => member.id);
        

        const primaryMembers = editProfile.familyMembers.filter(member => member.relationship === "Self" && member.isChecked);
       
        if (primaryMembers.length >0 ) {
            setWarningMessage("You are not allowed to delete the primary user in the family member list.");
            setTimeout(() => {
                setWarningMessage(null); //Reset the message after 3 seconds.
            }, 3000);
            return;
        }

        if (removedFamilyMembers.length > 0) {
            const response = await fetch(`http://localhost:8080/api/user/deleteFamilyMember`, {
                method:'DELETE',
                headers:{'Content-Type':'application/json'},
                credentials: 'include', // Include credentials to access the session
                body:JSON.stringify(removedID),
            });
            if (!response.ok) {
                throw new Error('Failed to remove family members');
            }
            const data = await response.text();
            setEditProfile((currentVal) => ({
                 ...currentVal,
                familyMembers: updatedFamilyMembers  
            }))
        } 
        else {
            setMessage("Please select at least one family member to remove.");
            return;
        }          
    }

    const handleSaveButton = async () => {
        const pwdPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        if(editProfile.password && !pwdPattern.test(editProfile.password)) {
            setMessage("Password must be at least 8 characters, include uppercase letter, number, and special character.");
            return;
          }
          setTimeout(() => {
            setMessage(null); //Reset the message after 3 seconds.
        }, 3000);
        
        
        try {
            const response = await fetch(`http://localhost:8080/api/user/updateUser`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Include credentials to access the session
                body: JSON.stringify(editProfile),
            });
            if (!response.ok) {
                throw new Error('Failed to update user profile');
            }
            const data = await response.json();
            setUserProfile(data);           
            setIsEdit(false);
            setEditProfile({...data,
                            password:""
            }); // Update the editProfile state with the updated data

            setMessage("Profile updated successfully.");
        } 
        
        catch (error) {
            console.error('Error updating user profile:', error);
        }
    };

    if (!userProfile) {
        return <div>Loading...</div>;
    }   

    return(
        <form onSubmit = {handleSaveButton}>
        <div className="container">
    
            <div className="content">
                <div className="message">
                    {message && <p className="message-update">{message}</p>}
                </div>  

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
                            (<input type="password" name="password" value={editProfile.password || ""} onChange={handleChange} pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$" 
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
                        <label>Street name *</label>
                            {isEdit ?
                                (<input type="text" name="street" value={editProfile.street || ""} onChange={handleChange} required/>)
                                : 
                                <span>{userProfile.street}</span>
                            }
                            <label>City *</label>
                            {isEdit ?
                                (<input type="text" name="city" value={editProfile.city || ""} onChange={handleChange} required/>)
                                : 
                                <span>{userProfile.city}</span>
                            }
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
                            <label>Zip Code *</label>
                            {isEdit ?
                                (<input type="text" name="zipCode" value={editProfile.zipCode || ""} onChange={handleChange} required/>)
                                : 
                                <span>{userProfile.zipCode}</span>
                            }       
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
                        {!isEdit ? (
                                userProfile.familyMembers && userProfile.familyMembers.length > 0 ? (
                                <ul className="family-members">
                                    {userProfile.familyMembers.map((member, index) => (
                                        <li key={index}>
                                        <span>{member.name} - {member.dob} - {member.relationship}</span>   
                                        </li>
                                    ))}
                                </ul>)
                            : 
                            (<ul>
                                (<li>No family members added.</li>)
                            </ul>)   
                        ) 

                        :
                        (editProfile.familyMembers && editProfile.familyMembers.length > 0 ? (
                            <ul className="family-members-edit">
                                {editProfile.familyMembers.map((member, index) => (
                                    <li key={index}>
                                        <input type="checkbox" checked={member.isChecked} onChange={(e) => handleCheckboxChange(e, index)} />
                                        <label>Name</label>
                                        <input type="text" value={member.name} onChange={(e) => handleFamilyMemberChange(e, index, 'name')} />
                                        <label>DOB</label>
                                        <input type="date" value={member.dob} onChange={(e) => handleFamilyMemberChange(e, index, 'dob')} />
                                        <label>Relationship</label>
                                        <select value={member.relationship} onChange={(e) => handleFamilyMemberChange(e, index, 'relationship')}>
                                            <option value=''>Select Relationship</option>
                                            <option value='Self'>Self</option>
                                            <option value='Spouse'>Spouse</option>
                                            <option value='Child'>Child</option>
                                            <option value='Parent'>Parent</option>
                                            <option value='Sibling'>Sibling</option>
                                            <option value='Other'>Other</option>
                                        </select>
                                    </li>
                                ))}
                               
                            </ul>)
                        :
                        (<ul>
                            (<li>No family members added.</li>)
                        </ul>))         
                        }   
                </div>
                
                <div>
                    
                    {isEdit ? (
                        <>
                            <ReusableButton type = "button" id="remove_family_member" name = "remove_family_member" onClick={handleRemoveFamilyMember}>Remove Family Member

                                {warningMessage && <p>{warningMessage}</p>}
                            </ReusableButton>
                            <ReusableButton type ="button" id="add_family_member" name = "add_family_member" onClick={handleAddFamilyMember}>Add Family Member</ReusableButton>
                            <ReusableButton id="save" name = "save">Save</ReusableButton> 
                            <ReusableButton id="cancel" name = "cancel" onClick={() => { setIsEdit(false)
                                                                                        setEditProfile({
                                                                                            ...userProfile,
                                                                                            familyMembers: userProfile.familyMembers?.map(m => ({ ...m, isChecked: false }))
                                                                                            });
                                                                                         }
                                                                                }
                            >Cancel</ReusableButton>
                        </>
                    ) :
                    <ReusableButton id="edit" name = "edit" onClick={handleEdit}>Edit</ReusableButton>
                    }
                    
                    
                </div>

            </div>
            <Footer />
        </div>
        </form>
    )
}

export default ExistingUser;
