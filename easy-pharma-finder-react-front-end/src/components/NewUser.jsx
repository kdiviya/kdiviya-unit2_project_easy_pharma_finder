import { Country, State } from 'country-state-city';
import { useEffect, useState } from 'react';
import Footer from './Footer';
import ReusableButton from './ReusableButton';
import { useLocation } from 'react-router-dom';

//Displays the new user form and store the user's details in the back end.
const NewUser = () => {
   
    //create state variable for country, state and get the values from the package "country-state-city"
    const[countries, setCountries] = useState(Country.getAllCountries());
    const[states, setStates] = useState([]);
    const[selectedCountry, setSelectedCountry] = useState(null); // create state variable to store the user selected country.

    //Hide the form after clicking submit button and display the confirmation messsage to the user using this state variable.
    const [isFormVisible, setIsformVisible] = useState(true);
    const location = useLocation();
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

    const [message, setMessage] = useState(null); //State variable to store messages.
    const [availableMessage, setAvailableMessage] = useState(null);
    const [usernameAvailable, setUsernameAvailable] = useState(null); //validate the new user's username availability using this variable.

     useEffect(() => {
            location.pathname === "/new-user" && setIsformVisible(true);
            setUser({
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
            setMessage(null);
        },[location]);

    //Update the state variable when the user enters the data in the form.
    const handleInputChange = (e) => {

        const { name, value } = e.target; //Assign the name and value of the HTML element.
        setUser((currentVal) => ({ //Update the user entered values to the state variable "user".
            ...currentVal,
            [name]:value
        }));

    };
    
    //Update the state variable when the user enters the family member details.
    const handleMemberChange = (e) => { 
        const { name, value } = e.target; //Assign the name and value of the HTML element.
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

    //Add the new family members in the 
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
                setMessage(null);
            }
                   
    };

    //Update the user's family member array with unchecked members.
    const handleRemoveFamilyMember = () => {

        setUser((currentVal) => ({
            ...currentVal,
            familyMembers: currentVal.familyMembers.filter((member) => !member.isChecked) //Filter the family members based on the checkbox checked state)
        }));
    };
    
    //Validate the username is already available or not using the GET() in the backend. And display the validation message to the user.
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
        }
        //Catch any errors from the try block and log errors for debugging purposes.
        catch(error) {
            console.error("Error in checking username availability");
        }

    };

    //Disappear the username available message  by using onFocus.
    const handleFocus = () => {
        setAvailableMessage(null);
    };

    //It triggers, when the user click the submit button. Save all the new user profile details into backend using POST().
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

        //check if the username change the name, if it is already available.
        if(!usernameAvailable) {
            setAvailableMessage({"message":"Username is not available. Please choose other name", "status":"error"})
            return;
        }
       
        //Save all the user details using POST() in the backend
        try {
            const response = await fetch('http://localhost:8080/api/user/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(user),
			});

             //Display the error messsage if response is not found
             if (!response.ok) {
                const errorText = await response.text();
                setMessage({
                    "message": errorText || "Submission failed. Please try again later.",
                    "status": "error"
                });
                return;
            }
            const data = await response.json();
            setIsformVisible(false);   //If the user clicks submit button, set the form to invisible.
		} 

        //Catch unexpected errors 
        catch (error) {
			console.error("Error during submission", error);
            setMessage({
                "message": "Submission failed. Please try again later.",
                "status": "error"
            });
        }
    
    };

    //This component returns a proper HTML structure inside the container div.
    return (
        <div className="container">
        
           { isFormVisible ?  //used conditional rendering for displaying the new user form

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
                        <input type="text" id="userName" name="userName" value={user.userName} onChange={handleInputChange} onBlur={(e) => checkUsernameAvailability(e.target.value)} onFocus={handleFocus} autoComplete="username" required></input>
                        {availableMessage && <p className='error'>{availableMessage.message}</p>}

                        <label>Enter your password *</label>
                        <input type="password" id="password" name="password" value={user.password} onChange={handleInputChange} autoComplete="password" pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$"
                            title="Password must be at least 5 characters, include an uppercase letter, a number, and a special character." required></input>
                            
                        <label>Enter your email address</label>
                        <input type='email' id="email" name="email" value={user.email} onChange={handleInputChange}></input>
                            
                        <label>Enter your contact number </label>
                        <input type="tel" id="contactNo" name="contactNo" placeholder="123-456-6789" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" value={user.contactNo} onChange={handleInputChange} ></input>
                            
                        <fieldset className="location-container">
                            <legend className="address">Address </legend>

                            <div>
                                <label>Street name *</label>
                                <input type="text" id="street" name="street" value={user.street} onChange={handleInputChange} required></input>
                            </div>
                            
                            <div>
                                <label>Country *</label>
                                <select className= "dropdown" id="country" name="country" value={ user.country || ""}  onChange={handleCountryChange} required>
                                    <option value=''>Select Country</option>
                                    {countries.map((country) => 
                                        (<option key={country.isoCode} value={country.name}>{country.name}</option>)
                                    )}
                                </select>  
                            </div>

                            <div>
                                <label>State *</label>
                                <select className= "dropdown" disabled={!selectedCountry} id="state" name="state" value={user.state} onChange={handleStateChange} required>
                                    <option value=''>Select State</option>
                                    {states.map((state) => 
                                        (<option key={state.isoCode} value= {state.name}>{state.name}</option>)
                                    )}
                                </select>
                            </div>

                            <div>
                                <label>City *</label>
                                <input type="text" id="city" name="city" value={user.city} onChange={handleInputChange} required></input>
                            </div>

                            <div>
                                <label>Zip code *</label>
                                <input type="text" id="zipCode" name="zipCode" value={user.zipCode} onChange={handleInputChange} required></input>
                            </div>

                        </fieldset>

                        <label>Select your insurance provider *</label>
                        <select className="provider-dropdown" id="insuranceProvider" name="insuranceProvider" value={user.insuranceProvider} onChange={handleInputChange} required>
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
                            { user.familyMembers.length > 0 &&
                                <>
                                    <h4>Family Members:</h4>
                                    <div>
                                        <table className="family-member">

                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Name</th>
                                                    <th>Relationship</th>
                                                    <th>DOB</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                            {user.familyMembers.map((member, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <input type="checkbox" checked={member.isChecked} onChange= { () => { 
                                                                const updatedMembers =  user.familyMembers.map((m, i) => i === index ? {...m, isChecked: !m.isChecked} : m);
                                                                setUser((currentVal) => ({
                                                                        ...currentVal,
                                                                        familyMembers: updatedMembers
                                                                }));  
                                                            }}/>
                                                        </td>
                                                        <td>{member.name}</td>
                                                        <td>{member.relationship}</td>
                                                        <td>{member.dob}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <ReusableButton id="remove-family-member" type="button" name="remove-family-member" onClick={handleRemoveFamilyMember}>Remove Family Member</ReusableButton>
                                </>
                            }
                        </div>
                        <div className="error-message">
                            {message && <p className="error">{message.message}</p>}
                        </div>
                        
                        <div className="button-submit">
                            <ReusableButton type="submit" id="submit" name="submit" >Submit</ReusableButton>
                            {availableMessage && <p className='error'>{availableMessage.message}</p>}
                        </div>

                    </form>
                </div> ) 

                :

                (<div className='content'>
                    <p>Your user account is created successfully. Please click the login button to login.</p>     
                </div>)   

            }

            <Footer />
        </div>
    );
};

export default NewUser;