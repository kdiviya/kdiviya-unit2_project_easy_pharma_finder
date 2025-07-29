import Header from './Header';
import Footer  from './Footer';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReusableButton from './ReusableButton';
import './css/login.css';

//Display the username and password when the user clicks the Login menu. {existingUserData} is passed as a props from App.jsx.
const LoginInfo = ({setUserLogged}) => {
    
    const navigate = useNavigate();

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

    const handleSignUpButton = () => {
        navigate("/new-user");
    }

    //User clicks the signin button, this function is called.
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
              
                //Check if the response is ok, if not, set the message to display error.
                if (!response.ok) {  
                    setMessage({"messaage":"Invalid username or password. Please try again.",
                        "status":"error"});
                    return;
                }  

                const data = await response.json();
                
                console.log("Login response:", data);
                localStorage.setItem("ID", data.sessionID); 
                localStorage.setItem("userName", userName);
                setUserLogged(userName); 

                 //Navigate to the ExistingUser component.
                //navigate("/family-member", {state: {userName}}); 
               
            } 
            
            catch (error) {
                console.error("Error during login:", error);
            }  

                  
            return;
        }  
        
        else {
            setMessage({
                "message":"Please enter your username and password.",
                "status":"error"
            });
        }
    };

    return (
        <div className="container">
         

            <div className="content">
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
                            {message.message}
                        </div>
                    )}
                                   
                        
                    <ReusableButton id="login-button" type="submit" name="signin" onClick={handleSignInButton}>SignIn</ReusableButton>
                    <ReusableButton id="newuser-button" type="submit" name="signup" onClick={handleSignUpButton}>SignUp</ReusableButton>

                </form>
            </div>

            <Footer />
        </div>
    )
}

export default LoginInfo;