import Header from './Header';
import Footer  from './Footer';

//Header(inlcudes nav links) and Footer components are reused. It is the about page for the users.
const About = () => {
    
    return(
        <div className="container">

            <Header />
            <div className="content">
                <h2 className='h2-animation'>Know More, Pay Less – About My Journey</h2>

                <p>I believe that everyone should have easy access to transparent, reliable, and personalized information about their medication costs. This application is committed to helping users to make informed decisions and compare prescription prices at local pharmacies.
                    It offers a quick, convenient way to see the actual costs of medications, including:
                </p>

                <ul className="about">
                    <li>The actual price of prescriptions.</li>
                    <li>Your deductible status and insurance copay information.</li>
                    <li>Personalized pricing based on pharmacy name and insurance plan.</li>
                </ul>
                   
                <p>We understand how important it is to know the full cost of medications in advance—whether you’re managing a chronic condition or simply looking for savings on prescriptions. With Easy Pharma Finder, you can be confident that you’ll always know exactly what to expect at the pharmacy—no hidden fees, no surprises.</p>

            </div>
            <Footer />

        </div>
       
    );
};

export default About;