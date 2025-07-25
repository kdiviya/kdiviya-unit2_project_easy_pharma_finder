import Header from './Header';
import Footer  from './Footer';

//Display the logout message wnhen the user clicks logout.
const Logout = () => {

    return (

        <div className='container'>
            <Header />

            <div className='content'>
                <p className='logout-p'> You have successfully logged out.</p>
            </div>

            <Footer />
        </div>
    )
}

export default Logout;