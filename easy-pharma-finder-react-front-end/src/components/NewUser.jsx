import { Country, State } from 'country-state-city';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import ReusableButton from './ReusableButton';
import { add } from 'date-fns';

//Displays the new user form and store the user's details dynamically.
const NewUser = () => {
   
    //create state variable for country, state and get the values from the package "country-state-city"
    const[countries, setCountries] = useState(Country.getAllCountries());
    const[states, setStates] = useState([]);
    const[selectedCountry, setSelectedCountry] = useState(null); // create state variable to store the user selected country.

    //Hide the form after clicking submit button and display the confirmation messsage to the user using this state variable.
    const [isFormVisible, setIsformVisible] = useState(true);

    //create state variable to navigate user data to other component "PharmacyFinder".
    const navigate = useNavigate();

    //Create a state variable to store the form data
    const [user, setUser]= useState({
        firstName: "",
        middleName: "",
        lastName: "",
        dob:"",
        userName:"",
        password:"",
        email:"",
        contactNo:"",
        street:"",
        country:"",
        state:"",
        city:"",
        zipCode:"",
        insuranceProvider:"",
        familyMembers: [],
        insuranceNumber:"",
        insuranceType:""
    });

    //Create a state variable to store the family member details 
    const [familyMember, setFamilyMember] = useState({
        name: "",
        relationship: "",
        dob: ""});

    const [message, setMessage] = useState(null); //State variable to store error messages.
    const [availableMessage, setAvailableMessage] = useState(null);
    const [usernameAvailable, setUsernameAvailable] = useState(null);

    //Update the state variable when the user enter's the data in the form.
    const handleInputChange = (e) => {

        const { name, value } = e.target; //Assign the name and value of the HTMl element.
        setUser((currentVal) => ({ //Update the user entered values to the state variable "user".
            ...currentVal,
            [name]:value
        }));

    };
    //Update the state variable when the user enter's the family member details.
    const handleMemberChange = (e) => { 
        const { name, value } = e.target; //Assign the name and value of the HTMl element.
        setFamilyMember((currentVal) => ({ //Update the family member details to the state variable "familyMember".
            ...currentVal,
            [name]:value
        }));
    };

   //When the user selects the country, all the states of that country is displayed
   const handleCountryChange = (e) => {
    
        const userSelectedCountry = e.target.value;
        const SelectedCountryObj = countries.find((country) => country.name === userSelectedCountry); //Get the country object based on the user selected country name.
       
        setUser((currentVal) => ({
            ...currentVal,
            country:userSelectedCountry
        }));
        setSelectedCountry(userSelectedCountry);
        if (SelectedCountryObj) {
            const stateList = State.getStatesOfCountry(SelectedCountryObj.isoCode);
            setStates(stateList); //It update the state variable "states" to the states based on the user selected country code.
        }
        else {
            setStates([]); //If the user selects the country, then reset the states to empty array.
        }
    
    };

    //When the user selects the state, update the user's state name.
    const handleStateChange = (e) => {
        const userSelectedState = e.target.value; //Get the user selected state name.

        //updates the state variable "user" when the user selects the state
        setUser((currentVal) => ({
            ...currentVal,
            state:userSelectedState
        }));
       
    };

    const handleAddFamilyMember = (e) => {
        //Check if the user has entered all the family member details.
        const button = e.target.name; //Get the button id to check which button is clicked.

            if (!familyMember.name || !familyMember.relationship || !familyMember.dob) {
                setMessage({
                    "message":"Please fill all the family member details.",
                    "status":"error"
                });
                return;
            }

            //If the user clicks the "Add Family Member" button, then display the success message
            if(button === "add-family-member") {

                setUser((currentVal) => ({
                    ...currentVal,
                    familyMembers: [...currentVal.familyMembers, familyMember] //Add the family member details to the user state variable.
                }));
            
                //Reset the family member details to null.
                setFamilyMember({
                    name:'',
                    relationship:'',
                    dob:'',
                });
            
                setMessage({
                    "message":"Family member added successfully!",
                    "status":"success"
                });
            }

            setTimeout(() => {
                setMessage(null); //Reset the message after 3 seconds.
            }, 3000);
                   
        }

        const handleRemoveFamilyMember = () => {

            setUser((currentVal) => ({
                ...currentVal,
                familyMembers: currentVal.familyMembers.filter((member) => !member.isChecked) //Filter the family members based on the checkbox checked state)
            }));

            setMessage({
                "message":"Family member removed successfully!",
                "status":"success"
            });

            setTimeout(() => {
                setMessage(null); //Reset the message after 3 seconds.
            }, 3000);
       
        }
    
    const checkUsernameAvailability = async (username) => {
        if(!username) return;
    
        try {
            const response = await fetch(`http://localhost:8080/api/user/checkUsername?username=${username}`, {
                method:'GET',
                credentials: 'include'
            });

            const data = await response.json();
            setUsernameAvailable(data);

            !data && setAvailableMessage({"message":"Username is not available. Please choose other name.", "status":"error"})
            setTimeout(() => {
                setAvailableMessage(null); //Reset the message after 3 seconds.
            }, 3000);
           
        }
        catch(error) {
            console.error("Error in checking username availability");
        }

    };
    //It triggers, when the user click the submit button.
    const handleSubmit = async (e) => {
        e.preventDefault();

        //Check if the user has added at least one family member.
        if (user.familyMembers.length === 0 ) {    
            setMessage({
                "message":"Please add at least one family member before submitting.",
                "status":"error"
            });
            return
        }
        
        //Check if the user has added himself/herself as a family member.
        if (!user.familyMembers.some(member => member.relationship === "Self")) {
            setMessage({
                "message":`Please add your name as family member with realtionship "Self" before submitting the form.`,
                "status":"error"
            });
            return;
        }

        if(!usernameAvailable) {
            setAvailableMessage({"message":"Username is not available. Please choose other name", "status":"error"})
            return;
        }
       
        try {
            const response = await fetch('http://localhost:8080/api/user/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(user),
			});

            if(!response.ok) {
                throw new Error('Failed to submit the form. Please try again later.');
            }

            const data = await response.json();
            setIsformVisible(false);   
		} 
        catch (error) {
			console.error(error.message);
        }
    
    };

    return (
        <div className="container">
           

           { isFormVisible ? 

                (<div className="content">
                    <h2 className='h2-animation'>New User Form </h2>

                    <form className="new-user-form" onSubmit={handleSubmit}> 

                        <label>Enter your first name *</label>
                        <input type="text" id="firstName" name="firstName" value={user.firstName} onChange={handleInputChange} required></input>
                            
                        <label>Enter your middle name</label>
                        <input type="text" id="middleName" name="middleName" value={user.middleName} onChange={handleInputChange} ></input>
                            
                        <label>Enter your last name *</label>
                        <input type="text" id="lastName" name="lastName" value={user.lastName} onChange={handleInputChange} required></input>
                            
                        <label>Select your date of birth *</label>
                        <input type="date" id="dob" name="dob" value={user.dob} onChange={handleInputChange} required></input>
                        
                        <label>Enter your user name *</label>
                        <div>  
                            <input type="text" id="userName" name="userName" value={user.userName} onChange={handleInputChange} onBlur={(e) => checkUsernameAvailability(e.target.value)} autoComplete="userName" required></input>
                            {availableMessage && <p>{availableMessage.message}</p>}
                        </div>

                        <label>Enter your password *</label>
                        <input type="password" id="password" name="password" value={user.password} onChange={handleInputChange} autoComplete="password" pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$"
                            title="Password must be at least 5 characters, include an uppercase letter, a number, and a special character." required></input>
                            
                        <label>Enter your email address</label>
                        <input type='email' id="email" name="email" value={user.email} onChange={handleInputChange}></input>
                            
                        <label>Enter your contact number </label>
                        <input type="tel" id="contactNo" name="contactNo" placeholder="123-456-6789" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" value={user.contactNo} onChange={handleInputChange} ></input>
                            
                        <fieldset className="location-container">
                            <legend className="address">Address </legend>
                            <label>Street name *</label>
                            <input type="text" id="street" name="street" value={user.street} onChange={handleInputChange} required></input>
                            
                            <div className="location">

                                <label>Country *</label>
                                <select className= "dropdown" id="country" name="country" value={ user.country || ""}  onChange={handleCountryChange} required>
                                    <option value=''>Select Country</option>
                                    {countries.map((country) => 
                                        (<option key={country.isoCode} value={country.name}>{country.name}</option>)
                                    )}
                                </select>  

                                <label>State *</label>
                                <select className= "dropdown" disabled={!selectedCountry} id="state" name="state" value={user.state} onChange={handleStateChange} required>
                                    <option value=''>Select State</option>
                                    {states.map((state) => 
                                        (<option key={state.isoCode} value= {state.name}>{state.name}</option>)
                                    )}
                                </select>

                            </div>

                            <label>City *</label>
                            <input type="text" id="city" name="city" value={user.city} onChange={handleInputChange} required></input>
                            <label>Zip code *</label>
                            <input type="text" id="zipCode" name="zipCode" value={user.zipCode} onChange={handleInputChange} required></input>
                            
                        </fieldset>

                        <label>Select your insurance provider *</label>
                        <select className="dropdown" id="insuranceProvider" name="insuranceProvider" value={user.insuranceProvider} onChange={handleInputChange} required>
                            <option value=''>Select Insurance Provider</option>
                            <option value='Aetna'>Aetna</option>
                            <option value='Blue Cross Blue Shield'>Blue Cross Blue Shield</option>
                        </select>

                        <label>Enter your insurance number *</label>
                        <input type="text" id="insuranceNumber" name="insuranceNumber" value={user.insuranceNumber} onChange={handleInputChange} required></input>
                
                        <fieldset className="insurance-type">
                            <legend>Please select insurance type *</legend>

                            <div className="radio-container">
                                <input type="radio" id="ppo" name="insuranceType" value="PPO" checked={user.insuranceType === "PPO"} onChange={handleInputChange} required></input>
                                <label>PPO</label>
                                
                                <input type="radio" id="hmo" name="insuranceType" value="HMO" checked={user.insuranceType === "HMO"} onChange={handleInputChange} required></input>
                                <label>HMO</label>
                            </div>

                        </fieldset>

                        <p><em>Note: Please include yourself by adding your own name as a family member with relationship "Self".</em></p>

                        <label>Name</label>
                        <input type="text" id="name" name="name" value={familyMember.name} onChange={handleMemberChange} ></input>
                        <label>Relationship</label>
                        <select className="dropdown" id="relationship" name="relationship" value={familyMember.relationship} onChange={handleMemberChange} >
                            <option value=''>Select Relationship</option>
                            <option value='Self'>Self</option>
                            <option value='Spouse'>Spouse</option>
                            <option value='Child'>Child</option>
                            <option value='Parent'>Parent</option>
                            <option value='Sibling'>Sibling</option>
                            <option value='Other'>Other</option>
                        </select>
                        <label>DOB</label>
                        <input type="date" id="family-dob" name="dob" value={familyMember.dob} onChange={handleMemberChange} ></input>

                        <div>
                            <ReusableButton id="add-family-member" type="button" name="add-family-member" onClick={handleAddFamilyMember}>Add Family Member</ReusableButton>
                            
                            <h4>Family Members:</h4>
                            <ul>
                                {user.familyMembers.map((member, index) => (
                                    <li key={index}>
                                        <input type="checkbox" checked={member.isChecked} onChange= { () => { 
                                            const updatedMembers =  user.familyMembers.map((m, i) => i === index ? {...m, isChecked: !m.isChecked} : m);
                                            setUser((currentVal) => ({
                                                ...currentVal,
                                                familyMembers: updatedMembers
                                            }));  
                                            }}/>

                                        {member.name} - {member.relationship} - {member.dob}
                                    </li>
                            ))}
                            </ul>

                            <ReusableButton id="remove-family-member" type="button" name="remove-family-member" onClick={handleRemoveFamilyMember}>Remove Family Member</ReusableButton>    

                        </div>
                        <div className="error-message">
                            {message && <p className="error">{message.message}</p>}
                        </div>
                        <div className="button-submit">
                            <ReusableButton type="submit" id="submit" name="submit" >Submit</ReusableButton>
                            {availableMessage && <p> {availableMessage.message}</p>}
                        </div>

                    </form>
                </div> ) 

                :

                (<div className='message'>
                    <p>Your user account is created successfully. Please click the login button to login.</p>     
                </div>)   

            }

            <Footer />
        </div>
    );
};

export default NewUser;