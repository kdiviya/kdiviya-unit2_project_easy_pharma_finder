import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import React from 'react';
import Footer  from './Footer';
import ReusableButton from './ReusableButton';
import './css/login.css';

//Display the username and password when the user clicks the Login menu. loggedusername is passed as a props to App.jsx.
const LoginInfo = ({setUserLogged}) => {
    
    const navigate = useNavigate();
    const location = useLocation();

    //create state variable to store the logged user credentials.
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(""); //store the validation and notification message to the user.

    //Assign username value to variable userName.
    const handleUserNameChange = (e) => {
        setUserName(e.target.value);
    };
 
    //Assign password value to variable Password.
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    //If the new user click to sign up, it navigates to new user form.
    const handleSignUpButton = () => {
        navigate("/new-user");
    }

    //If user clicks the login menu, it reset the page.
    useEffect (() => { 
            setUserName("");
            setPassword("");
            setMessage("");
        
    }, [location.key]);

    //Validate the user entered credential using the POST method and check user authentication
    const handleSignInButton = async (e) => {
        e.preventDefault();
       
        //Check if the user has entered username and password.
        if (userName && password )  {
            
            try {
                const response = await fetch('http://localhost:8080/api/user/login', {
                    method:'POST',
                    headers:{'Content-Type':'application/json'},
                    credentials: 'include', // Include credentials to access the session
                    body:JSON.stringify({userName, password}),
                });
                if (response.status === 401) {
                    setMessage({
                      message: "Unauthorized: Invalid username or password. Please try again.",
                      status: "error",
                    });
                    return;
                  }
                //Check if the response is not ok, set the message to display error.
                if (!response.ok) {  
                    setMessage({"message":"Invalid username or password. Please try again.",
                        "status":"error"});
                    return;
                }  

                const data = await response.json(); 
                localStorage.setItem("ID", data.sessionId); //store the session id and username in the local storage.
                localStorage.setItem("userName", data.userName);
                setUserLogged(data.userName); 

                 //Navigate to the ExistingUser component.
                navigate(`/family-members/${userName}`); 
               
            } 
            //Catch any errors thrown from the try block and log errors for debugging purposes.
            catch (error) {
                console.error("Error during login:", error);
            }               
        }  
        
        //Display the message to user if they didnt enter the credentials.
        else {
            setMessage({
                "message":"Please enter your username and password.",
                "status":"error"
            });
        }
    };

   //used semantic elements (header, main, footer in the return)
    return (
        <div className="container">
            <main className="content">
                <form className = "login-form">

                    <div>
                        <label>Username *</label>
                        <input type="text" id="name" name="userName" value={userName} onChange={handleUserNameChange} autoComplete='userName'></input>
                    </div>

                    <div>
                        <label>Password *</label>
                        <input type="password" id="password" name="password" value={password} onChange={handlePasswordChange} autoComplete='password' ></input>
                    </div>

                    {message && (
                        <div className={`${message.status}`}>
                           <p className="error"> {message.message}</p>
                        </div>
                    )}
                                   
                    <div>  
                        <ReusableButton id="login-button" type="submit" name="signin" onClick={handleSignInButton}>SignIn</ReusableButton>
                        <ReusableButton id="newuser-button" type="submit" name="signup" onClick={handleSignUpButton}>SignUp</ReusableButton>
                    </div>  
                </form>
            </main>

            <Footer />
        </div>
    )
}

export default LoginInfo;