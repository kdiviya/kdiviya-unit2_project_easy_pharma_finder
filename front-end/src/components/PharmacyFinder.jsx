import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ReusableButton from './ReusableButton';
import prescriptionData from '../sample-data/prescriptionData.json';
import './css/pharmacy.css';

//Display the detailed cost breakdown across the pharmacies based on the user's pincode.
const PharmacyFinder = ({pharmacyData}) => { //pharmacyData is passed as props from the parent component App.jsx

    //create variable to access the navigated data.
    const location = useLocation();

    //create object to access the data navigated from NewUser.jsx
    const user = location.state.user; //Destructuring an user object
   
    //create object to access the data navigated from ExistingUser.jsx
    const existingUser = location.state.loggedUser;

    //Assign the new user or existing user's zipcode.
    let zipCode = user ? user.zipCode : existingUser.address.zipCode;
    
    const pharmacyArr =[]; //Array that contains the pharmacy names for user's pin code.
    const medList = {}; //Object that contains the medication details
    const totalCost= {}; //Object that  conatins the pharmacy name and the total medication cost.
    
    
    //Add the pharmacy names into an array "pharmacyArr" by checking user's zipcode 
    if(pharmacyData[zipCode] ) {
        pharmacyData[zipCode].forEach((name) => {
        pharmacyArr.push(name.pharmacyName);
        });
    
    //Iterate the pharmacyArr and get the medication details for each pharmacy and stored into object "medList"
        for(let idx=0; idx<pharmacyArr.length; idx++) {
            const pharmacyName = pharmacyArr[idx];

            if(prescriptionData[pharmacyName]) {

                let totalPrice = 0;
                medList[pharmacyName] = prescriptionData[pharmacyName].map((medication) => {

                    let copay = medication.actualCost - ((medication.insurancePaidPercent/100) * medication.actualCost); //calculate the copay
                    totalPrice += copay;
                        return {
                            med: medication.medicationName,
                            cost: medication.actualCost,
                            insuranceDeduction: medication.insurancePaidPercent,
                            copay:copay,      
                        };
                }); 
            totalCost[pharmacyName]= medList[pharmacyName].reduce((sum, med) => sum + med.copay, 0);
            }     
        }     
    }

    //Redirects the user to that particular pharmacy order page once the clicks the "click to order" button.
    const handleOrder = (e) => {

        const pharmacyName = e.target.name;
        let url;
        
        if (pharmacyName === "CVS Pharmacy") {
            url = "https://www.cvs.com/pharmacy";
        }
        else if (pharmacyName === "Costco Pharmacy") {
            url = "https://www.costco.com/pharmacy/home-delivery";
        }
        else if (pharmacyName === "Walgreens Pharmacy") {
            url = "https://www.walgreens.com/topic/pharmacy.jsp";
        }
        else if (pharmacyName === "Walmart Pharmacy") {
            url = "https://www.walmart.com/cp/pharmacy/5431";
        }

        window.open(url, '_blank');
    };
  
    return (
        <div className="p-container">
            <Header />

            <div className="p-content"> 
                <h2 className='h2-animation'>Pharmacy Prescription Details</h2>

                { Object.keys(medList).map((pName)=> (
                    <div key={pName}>
                        <h3>{pName}</h3>

                        <div className="med-table">
                            <table className="medication-table">

                                <thead>
                                    <tr>
                                        <th>Medication Name</th>
                                        <th>Actual Cost</th>
                                        <th>Insurance Deduction</th>
                                        <th>Copay</th>
                                    </tr>
                                </thead>

                                <tbody>   

                                    { medList[pName].map((medLists) => (
                                        <tr key={medLists.med}>
                                            <td>{medLists.med}</td>
                                            <td>${medLists.cost}</td>
                                            <td>{medLists.insuranceDeduction}%</td>
                                            <td>${medLists.copay}</td>       
                                        </tr>
                                    ))}
        
                                    <tr className="total-cost" >
                                        <td colSpan={3}>Total Cost</td>
                                        <td>${totalCost[pName]}</td> 
                                    </tr>

                                </tbody>

                            </table>
                           
                            <div className="order-button">
                                <ReusableButton type="button" name={pName} onClick={handleOrder}>Click to order</ReusableButton>
                            </div>

                        </div>

                    </div>
                ))}
                
            </div>

            <Footer />
        </div>             
    )   
};

export default PharmacyFinder;