import { Country, State } from 'country-state-city';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ReusableButton from './ReusableButton';

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
        email:"",
        phoneNumber:"",
        visitedDate:"",
        streetName:"",
        country:"",
        state:"",
        city:"",
        zipCode:"",
        insuranceNumber:"",
        insuranceType:""
    });

    //Update the state variable when the user enter's the data in the form.
    const handleInputChange = (e) => {

        const { name, value } = e.target; //Assign the name and value of the HTMl element.
        setUser((currentVal) => ({ //Update the user entered values to the state variable "user".
            ...currentVal,
            [name]:value
        }));

    };

   //When the user selects the country, all the states of that country is displayed
   const handleCountryChange = (e) => {

        const userSelectedCountry = countries.find((country) => country.name === e.target.value);   
        setSelectedCountry(userSelectedCountry);
        setUser((currentVal) => ({
            ...currentVal,
            country:userSelectedCountry
        }));

        const stateList = State.getStatesOfCountry(userSelectedCountry.isoCode);
        setStates(stateList); //It update the state variable "states" to the states based on the user selected country code.
    };

    //When the user selects the state, update the user's state name.
    const handleStateChange = (e) => {
        const userSelectedState = states.find((state) => state.name === e.target.value);//Get the details(ie state object) of user selected state value.

        //updates the state variable "user" when the user selects the state
        setUser((currentVal) => ({
            ...currentVal,
            state:(userSelectedState ? userSelectedState.name: "")
        }));
       
    };

    //It triggers, when the user click the submit button.
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsformVisible(!isFormVisible);    
    }

    return (
        <div className="container">
            <Header />

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
                            
                        <label>Enter your email address</label>
                        <input type='email' id="email" name="email" value={user.email} onChange={handleInputChange}></input>
                            
                        <label>Enter your contact number *</label>
                        <input type="tel" id="phoneNumber" name="phoneNumber" placeholder="123-456-6789" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" value={user.phoneNumber} onChange={handleInputChange} required></input>
                            
                        <label>Select your last visited date to the hospital *</label>
                        <input type="date" id="visitedDate" name="visitedDate" value={user.visitedDate} onChange={handleInputChange} required></input>
                    
                        <fieldset className="location-container">
                            <legend className="address">Address *</legend>
                            <label>Street name</label>
                            <input type="text" id="streetName" name="streetName" value={user.streetName} onChange={handleInputChange}></input>
                            
                            <div className="location">

                                <label>Country</label>
                                <select className= "dropdown" id="country" name="country" value={ user.country.name ? user.country.name:""}  onChange={handleCountryChange} >
                                    <option value=''>Select Country</option>
                                    {countries.map((country) => 
                                        (<option key={country.isoCode} value={country.name}>{country.name}</option>)
                                    )}
                                </select>  

                                <label>State</label>
                                <select className= "dropdown" disabled={!selectedCountry} id="state" name="state" value={user.state} onChange={handleStateChange}>
                                    <option value=''>Select State</option>
                                    {states.map((state) => 
                                        (<option key={state.isoCode} value= {state.name}>{state.name}</option>)
                                    )}
                                </select>

                            </div>

                            <label>City </label>
                            <input type="text" id="city" name="city" value={user.city} onChange={handleInputChange} required></input>
                            <label>Zip code *</label>
                            <input type="text" id="zipCode" name="zipCode" value={user.zipCode} onChange={handleInputChange} required></input>
                            
                        </fieldset>

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

                        <div className="button-submit">
                            <ReusableButton type="submit" id="submit" name="submit" >Submit</ReusableButton>
                        </div>

                    </form>
                </div> ) 

                :

                (<div className='message'>
                    <p>You have successfully submitted the form. Please click the below button to view your prescription cost at pharmacies near your location.</p>

                    <ReusableButton id="pharma-finder" type ="button" name="pharma-finder" onClick= { () => 
                                                        navigate('/pharma-finder', {state:{user}} )//Navigate to pharma finder page and passing the user data, when the user clicks the button.
                                                    }
                    >Pharmacy Finder</ReusableButton>
                    
                </div>)   

            }

            <Footer />
        </div>
    );
};

export default NewUser;