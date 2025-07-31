import { useState, useEffect, use } from 'react';
import Footer from './Footer';
import { Country, State } from 'country-state-city';
import ReusableButton from './ReusableButton';
import './css/existing-user.css';
import { is } from 'date-fns/locale';

//Display the profile details when the existing user logged-in.
const ExistingUser = ({userLogged}) => {
    const [userProfile, setUserProfile] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [editProfile, setEditProfile] = useState(false);

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
                console.log('User Profile:', data);
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

    const handleEdit = () => {
        setIsEdit(true);
        setEditProfile(userProfile);
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

    if (!userProfile) {
        return <div>Loading...</div>;
    }   

    return(
        <div className="container">
    
            <div className="content">
                
                <div className="profile">
                    <h2 className="h2-animation">Profile Details</h2>
                    <div>
                        <label> First Name: </label>
                        {isEdit ?
                            (<input type="text" name="firstName" value={editProfile.firstName} onChange={handleChange} />)
                            : 
                            <span>{userProfile.firstName}</span>
                        } 
                    </div>
                    <div>
                        <label> Middle Name: </label>
                        {isEdit ?
                            (<input type="text" name="lastName" value={editProfile.middleName} onChange={handleChange} />)
                            : 
                            <span>{userProfile.middleName}</span>
                        }  
                    </div>    
                    <div> 
                        <label> Last Name: </label>
                        {isEdit ?
                            (<input type="email" name="email" value={editProfile.lastName} onChange={handleChange} />)
                            : 
                            <span>{userProfile.lastName}</span>
                        }
                    </div> 

                    <div>
                        <label>DOB: </label>
                        {isEdit ?
                            (<input type="date" name="dob" value={editProfile.dob} onChange={handleChange} />)
                            : 
                            <span>{userProfile.dob}</span>
                        }   
                    </div>

                    <div>
                        <label>Username: </label>
                        {isEdit ?
                            (<input type="text" name="username" value={editProfile.userName} onChange={handleChange} />)
                            : 
                            <span>{userProfile.userName}</span>
                        }   
                    </div>

                    <div>
                        <label>Password: </label>
                        {isEdit ?
                            (<input type="password" name="password" value={editProfile.password} onChange={handleChange} />)
                            : 
                            <span>**********</span>
                        }   
                    </div>

                    <div>
                        <label> Email: </label>
                        {isEdit ?
                            (<input type="email" name="email" value={editProfile.email} onChange={handleChange} />)
                            : 
                            <span>{userProfile.email}</span>
                        }   
                    </div>

                    <div>
                        <label> Contact Number: </label>
                        {isEdit ?
                            (<input type="tel" name="contactNo" value={editProfile.contactNo} onChange={handleChange} />)
                            : 
                            <span>{userProfile.contactNo}</span>
                        }   
                    </div>

                    <div>
                        <fieldset className="location-container">
                        <legend className="address">Address *</legend>
                        <label>Street name</label>
                            {isEdit ?
                                (<input type="text" name="streetName" value={editProfile.street} onChange={handleChange} />)
                                : 
                                <span>{userProfile.street}</span>
                            }
                            <label>City</label>
                            {isEdit ?
                                (<input type="text" name="city" value={editProfile.city} onChange={handleChange} />)
                                : 
                                <span>{userProfile.city}</span>
                            }
                            <label>State</label>
                            {isEdit ?
                                (<select className="dropdown" name="state" value={editProfile.state} onChange={handleChange}>
                                    <option value="">Select State</option>
                                    {states.map(state => (
                                        <option key={state.isoCode} value={state.name}>{state.name}</option>
                                    ))}
                                </select>)
                                : 
                                <span>{userProfile.state}</span>
                            }
                            <label>Country</label>
                            {isEdit ?
                                (<select className="dropdown" name="country" value={editProfile.country} onChange={handleChange}>
                                    <option value="">Select Country</option>
                                    {countries.map(country => (
                                        <option key={country.isoCode} value={country.name}>{country.name}</option>
                                    ))}
                                </select>)
                                : 
                                <span>{userProfile.country}</span>
                            }
                            <label>Zip Code</label>
                            {isEdit ?
                                (<input type="text" name="zipCode" value={editProfile.zipCode} onChange={handleChange} />)
                                : 
                                <span>{userProfile.zipCode}</span>
                            }       
                        </fieldset>
                    </div>

                    <div> 
                        <label>Insurance Provider</label>  
                        {isEdit ?
                           (<select className="dropdown" name="insuranceProvider" value={editProfile.insuranceProvider} onChange={handleChange}>
                                <option value="">Select Insurance Provider</option>
                                <option value="Aetna">Aetna</option>
                                <option value="Blue Cross Blue Shield">Blue Cross Blue Shield</option>
                            </select>)
                            : 
                            <span>{userProfile.insuranceProvider}</span>
                        }       
                    </div>
                    <div>
                        <label>Insurance Number</label>  
                        {isEdit ?
                            (<input type="text" name="insuranceNumber" value={editProfile.insuranceNumber} onChange={handleChange} />)
                            : 
                            <span>{userProfile.insuranceNumber}</span>
                        }   
                    </div>
                    <div>
                        <label>Insurance Type</label>  
                        {isEdit ? (
                            <div>
                                <label>
                                    <input type="radio" name="insuranceType" value="HMO" checked = {editProfile.insuranceType === "HMO"} onChange={handleChange} /> HMO
                                </label>
                                <label>
                                    <input type="radio" name="insuranceType" value="PPO" checked = {editProfile.insuranceType === "PPO"} onChange={handleChange} /> PPO
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
                                        <input type="text" name={`familyMemberName_${index}`} value={member.name} onChange={handleChange} />
                                        <label>DOB</label>
                                        <input type="date" name={`familyMemberDob_${index}`} value={member.dob} onChange={handleChange} />
                                        <label>Relationship</label>
                                        <select name={`familyMemberRelationship_${index}`} value={member.relationship} onChange={handleChange}>
                                            <option value="">Select Relationship</option>
                                            <option value="Spouse">Spouse</option>
                                            <option value="Child">Child</option>
                                            <option value="Parent">Parent</option>
                                            <option value="Sibling">Sibling</option>
                                            <option value="Other">Other</option>
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
                    <ReusableButton id="edit" name = "edit" onClick={handleEdit}>Edit</ReusableButton>
                    {isEdit && (
                        <>
                            <ReusableButton type = "button" id="remove_family_member" name = "remove_family_member">Remove Family Member</ReusableButton>
                            <ReusableButton id="add_family_member" name = "add_family_member">Add Family Member</ReusableButton> 
                        </>
                    )}
                    
                    <ReusableButton id="save" name = "save">Save</ReusableButton>
                </div>

            </div>
            <Footer />
        </div>
    )
}

export default ExistingUser;
