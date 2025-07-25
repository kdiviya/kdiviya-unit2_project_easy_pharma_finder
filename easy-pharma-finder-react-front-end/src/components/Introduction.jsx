import Header from './Header';
import Footer  from './Footer';

//Header(inlcudes nav links) and Footer components are reused. It displays the project introduction to the user.
const Introduction = () => {

    return (
        
        <div className="container">
           <Header />

            <div className="content">
                <h2 className="h2-animation">Welcome To Easy Pharma Finder !!!</h2>
                <p>Easy Pharma Finder, is designed to help insured users navigate the complex world of prescription medication costs. With healthcare plans constantly changing and insurance companies frequently shifting medication providers, it can be difficult for patients and caregivers to understand the true cost of their prescriptions.
                    Easy Pharma Finder aims to support users by providing clear, transparent, and personalized pricing information for their medications. Users can easily compare the actual cost of prescriptions at local pharmacies based on their zip-code. </p> <p>The application lists their actual cost, deductible status, and insurance copay all-in-one easy to read view.
                    The goal of this application is to eliminate the confusion around prescription costs, saving users both time and money. We strive to deliver an accurate, up-to-date pricing comparison tool that helps families, caregivers, and individuals with chronic conditions make informed decisions before placing an order.
                    Whether you’re managing a chronic condition or simply looking to save on medications, Easy Pharma Finder ensures that you always know what you’ll pay no surprises.
                </p>
            </div>

            <Footer />            
        </div>     
    );

};

export default Introduction;