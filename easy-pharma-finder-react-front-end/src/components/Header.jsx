import { Link } from 'react-router-dom';
import {useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUser,faMortarPestle, faLock, faRightFromBracket, faBars} from '@fortawesome/free-solid-svg-icons';
import logo from './images/logo.jpeg';

//Displays the title and the nav link menus on the header. This component is reused in all the pages based on the user interaction.
const Header = () => {

    //create state variable to store the user's logged in name.
    const [userLogged, setUserLogged] = useState("");
    const [showMobileMenu, setShowMobileMenu] = useState(false); // create state variable to display the bar icon menu for tablets and mobiles

    //Every time page loads, get the username from the local storage if any.
    useEffect( () => {
        let user = localStorage.getItem("userName");
        setUserLogged(user);
        },
    []);

    //Once user clicks the logout menu, the credentials is deleted from the local storage and the same is updated on "userLogged".
    const handleLogout = () => {
        localStorage.removeItem("userName");
        localStorage.removeItem("password");
        setUserLogged(""); 

    }

    //set the value true or false to display the menu when the user click the toogle in mobile/tabs
    const toggleMobileMenu = () => {  
        setShowMobileMenu(currentVal => !currentVal);
    }

    return (
        <nav className="custom-nav">
            <img src={logo} alt="Pharmacy symbol - Mortar Pestle Logo" className="logo"/>
            <h1>Easy Pharma Finder</h1>

            <span className ="toggle-menu" onClick={toggleMobileMenu}>  
                <FontAwesomeIcon icon={faBars} size="2x" />
            </span>

            <ul id="menu">
                <li><Link to="/"><FontAwesomeIcon icon={faHouse} />Home</Link></li>
                <li><Link to="/about"><FontAwesomeIcon icon={faMortarPestle} />About us</Link></li>

                { //If user is logged, then username and logout should be displayed in the nav link
                    userLogged != "" && userLogged !== null &&
                    <>
                        <li><span><FontAwesomeIcon icon={faUser} /></span>{userLogged}</li>
                        <li><Link to= "/logout" onClick={handleLogout}><FontAwesomeIcon icon={faRightFromBracket} />Logout</Link></li>   
                    </>
                }

                { //The New User and Login should be dispalyed if the user is not logged in.
                    (userLogged == ""  || userLogged == null ) &&  
                    <>
                        <li><Link to= "/new-user"><FontAwesomeIcon icon={faUser}/>New user</Link></li>
                        <li><Link to="/login"><FontAwesomeIcon icon={faLock}/>Login</Link></li>
                    </>
                }
                
            </ul>

            { //Used conditional rendering to show the bar icon for mobiles and tablets.
                showMobileMenu && 

                (<div id="mobile-menu">
                    <ul id ="mobile-menu-ul">
                        <li><Link to="/"><FontAwesomeIcon icon={faHouse} />Home</Link></li>
                        <li><Link to="/about"><FontAwesomeIcon icon={faMortarPestle} />About us</Link></li>
                        {
                            userLogged != "" && userLogged !== null &&
                            <>
                                <li><span><FontAwesomeIcon icon={faUser} /></span>{userLogged}</li>
                                <li><Link to= "/logout" onClick={handleLogout}><FontAwesomeIcon icon={faRightFromBracket} />Logout</Link></li>
                            </>
                        }

                        {
                            (userLogged == ""  || userLogged == null ) &&  
                            <>
                                <li><Link to= "/new-user"><FontAwesomeIcon icon={faUser}/>New user</Link></li>
                                <li><Link to="/login"><FontAwesomeIcon icon={faLock}/>Login</Link></li>
                            </>
                        }
                
                    </ul>
                </div>)
            }

        </nav>
    );

};

export default Header;