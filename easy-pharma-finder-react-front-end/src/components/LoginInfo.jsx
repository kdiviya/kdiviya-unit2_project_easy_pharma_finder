import Header from './Header';
import Footer  from './Footer';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReusableButton from './ReusableButton';
import './css/login.css';

//Display the username and password when the user clicks the Login menu. {existingUserData} is passed as a props from App.jsx.
const LoginInfo = () => {
    
    //create state variable to store the logged user credentials.
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(""); 

    const handleUserNameChange = (e) => {
        setUserName(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    
    //when the user clicks the login button, it username and password is stored in the local storage.
    const handleLoginButton = async (e) => {
        e.preventDefault();
        
        //Check if the user has entered username and password.
        if (userName === "" || password === "") {
            setMessage("Please enter both username and password.");
            return;
        }   

        try {
            const response = await fetch('http://localhost:8080/api/user/login', {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({userName, password}),
            });
           
            if (!response.ok) {
              
                setMessage("Invalid username or password. Please try again.");
            }
            const data = await response.text();
            setMessage(data);           
        } catch (error) {
            console.error("Error during login:", error);
        }                       
    };

    return (
        <div className="container">
            <Header />

            <div className="content">
                <form className = "login-form" onSubmit= {handleLoginButton}>

                    <div>
                        <label>Username *</label>
                        <input type="text" id="name" name="userName" value={userName} onChange={handleUserNameChange} required></input>
                    </div>

                    <div>
                        <label>Password *</label>
                        <input type="password" id="password" name="password" value={password} onChange={handlePasswordChange} required></input>
                    </div>
                    {message && (
                        <div className="error-message">
                            <p>{message}</p>
                        </div>
                    )}
                    <ReusableButton id="login-button" type="submit" name="login">Login</ReusableButton>

                </form>
            </div>

            <Footer />
        </div>
    )
}

export default LoginInfo;