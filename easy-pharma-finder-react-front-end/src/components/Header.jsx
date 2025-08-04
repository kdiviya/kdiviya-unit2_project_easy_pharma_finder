import { Link } from 'react-router-dom';
import { useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUser,faMortarPestle, faLock, faRightFromBracket, faBars, faUsers, faComment} from '@fortawesome/free-solid-svg-icons';
import logo from './images/logo.jpeg';

//Displays the title and the nav link menus on the header.
const Header = ({userLogged}) => {

    const [showMobileMenu, setShowMobileMenu] = useState(false); // create state variable to display the bar icon menu for tablets and mobiles

    //set the value true or false to display the menu when the user click the toogle in mobile/tabs
    const toggleMobileMenu = () => {  
        setShowMobileMenu(currentVal => !currentVal);
    }

    return (
        <header>
            <nav className="custom-nav">
                <img src={logo} alt="Pharmacy symbol - Mortar Pestle Logo" className="logo"/>
                <h1>Easy Pharma Finder</h1>

                <ul id="menu">
                    <li><Link to="/"><FontAwesomeIcon icon={faHouse} />Home</Link></li>
                    <li><Link to="/about"><FontAwesomeIcon icon={faMortarPestle} />About us</Link></li>

                    { //If user is logged, then username, family members and logout should be displayed in the nav link
                        userLogged != "" && userLogged !== null && userLogged !== undefined &&
                        <>
                            <li><Link to="/existing-user"><span><FontAwesomeIcon icon={faUser} /></span>{userLogged}</Link></li>
                            <li><Link to= {`/family-members/${userLogged}`}><FontAwesomeIcon icon={faUsers} />Family Members</Link></li>
                            <li><Link to= "/logout" ><FontAwesomeIcon icon={faRightFromBracket} />Logout</Link></li>   
                            
                        </>
                    }

                    { //The New user, Login and Feedback menus should be displayed if the user is not logged in.
                        (userLogged == ""  || userLogged == null ) &&  
                        <>
                            <li><Link to= "/new-user"><FontAwesomeIcon icon={faUser}/>New user</Link></li>
                            <li><Link to="/login"><FontAwesomeIcon icon={faLock}/>Login</Link></li>
                            <li><Link to="/feedback"><FontAwesomeIcon icon={faComment}/>Feedback</Link></li>

                        </>
                    }
                    
                </ul>

                <span onClick={toggleMobileMenu}>
                    <span className ="toggle-menu" >  
                        <FontAwesomeIcon icon={faBars} size="2x" />
                    </span>

                    { //Used conditional rendering to show the bar icon for mobiles and tablets.
                        showMobileMenu && 

                            (<div id="mobile-menu">
                                <ul id ="mobile-menu-ul">
                                    <li><Link to="/"><FontAwesomeIcon icon={faHouse} />Home</Link></li>
                                    <li><Link to="/about"><FontAwesomeIcon icon={faMortarPestle} />About us</Link></li>
                                    {
                                        userLogged != "" && userLogged !== null &&
                                        <>
                                            <li><Link to="/existing-user"><span><FontAwesomeIcon icon={faUser} /></span>{userLogged}</Link></li>
                                            <li><Link to= {`/family-members/${userLogged}`}><FontAwesomeIcon icon={faUsers} />Family Members</Link></li>
                                            <li><Link to= "/logout" ><FontAwesomeIcon icon={faRightFromBracket} />Logout</Link></li>   
                                        </>
                                    }

                                    {
                                        (userLogged == ""  || userLogged == null ) &&  
                                        <>
                                            <li><Link to= "/new-user"><FontAwesomeIcon icon={faUser}/>New user</Link></li>
                                            <li><Link to="/login"><FontAwesomeIcon icon={faLock}/>Login</Link></li>
                                            <li><Link to="/feedback"><FontAwesomeIcon icon={faComment}/>Feedback</Link></li>
                                        </>
                                    }
                            
                                </ul>
                            </div>)
                    }
                </span>

            </nav>
        </header>
    );

};

export default Header;