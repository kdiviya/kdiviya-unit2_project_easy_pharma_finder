import Footer  from './Footer';
import React, { useEffect } from 'react';

//Display the logout message when the user clicks logout.
const Logout = ({setUserLogged}) => {
    

    //Clear the userLogged state and localStorage when the user logs out.
   useEffect(() => {
        setUserLogged(null);
        localStorage.removeItem("ID");
        localStorage.removeItem("userName");
        setUserLogged(null);
       
    }, [setUserLogged]);

    return (

        <div className='container'>
      

            <div className='content'>
                <p className='logout-p'> You have successfully logged out.</p>
            </div>

            <Footer />
        </div>
    )
}

export default Logout;