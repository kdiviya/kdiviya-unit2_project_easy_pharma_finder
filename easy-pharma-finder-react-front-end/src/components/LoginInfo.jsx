import Header from './Header';
import Footer  from './Footer';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReusableButton from './ReusableButton';
import './css/login.css';

//Display the username and password when the user clicks the Login menu. {existingUserData} is passed as a props from App.jsx.
const LoginInfo = ({existingUserData}) => {
    
    //create state variable to store the logged user credentials.
    const [login, setLogin] = useState({
        userName:"",
        password:""
    });

    //create navigate variable for navigating to existing user details page and passed the logged user's data.
    const navigate = useNavigate();

    //update the user entered username and password 
    const handleChange = (e) => {
        const{name, value} =  e.target;

        setLogin(currentVal => ({
            ...currentVal,
            [name]:value
        }));

    };
    
    //when the user clicks the login button, it username and password is stored in the local storage.
    const handleLoginButton = (e) => {
        e.preventDefault();
        const foundUser = existingUserData.find((user) => user.userName === login.userName); //Assign the logged user details to foundUser.

        if(foundUser) {
            localStorage.setItem("userName", login.userName);
            localStorage.setItem("password", login.password); 
            navigate('/existing-user', {state:{foundUser}}); //pass the logged user details to /existing-user page
        }
        
    };

    return (
        <div className="container">
            <Header />

            <div className="content">
                <form className = "login-form" onSubmit= {handleLoginButton}>

                    <div>
                        <label>Username</label>
                        <input type="text" id="name" name="userName" value={login.userName} onChange={handleChange}></input>
                    </div>

                    <div>
                        <label>Password</label>
                        <input type="password" id="password" name="password" value={login.password} onChange={handleChange}></input>
                    </div>
                    
                    <ReusableButton id="login-button" type="submit" name="login">Login</ReusableButton>

                </form>
            </div>

            <Footer />
        </div>
    )
}

export default LoginInfo;