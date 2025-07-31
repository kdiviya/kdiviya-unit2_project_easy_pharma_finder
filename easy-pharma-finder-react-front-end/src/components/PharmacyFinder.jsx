import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ReusableButton from './ReusableButton';
import './css/pharmacy.css';


//Display the detailed cost breakdown across the pharmacies based on the user's pincode.
const PharmacyFinder = () => { 
  
    const location = useLocation();
    const {memberId, userName} = location.state || {}; // Destructure id and userName from location.state, defaulting to empty if not present
    const [costBreakdownData , setCostBreakdownData] = useState([]);
    const [message, setMessage] = useState(false);
   
    useEffect(() => {
        const fetchPharmacyData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/user/pharmacy-details?userName=${userName}&familyMemberId=${memberId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include' // Include credentials to access the session
                });
                if (!response.ok) {
                    setMessage("No Medication details are associated with that family member");
                }
                const data = await response.json();
                setCostBreakdownData(data);              
                
            } catch (error) {
                console.error("Pharmacy data not found");
            }
        };  
        if (userName && memberId) {
            fetchPharmacyData();
        } else {
            console.error("userName or memberId is not defined");
        }
    }, [userName, memberId]); // Add userName and memberId as dependencies    


    const totalCost = (pharmacyName) => {
        
        const pharmacy = costBreakdownData.filter(pName => pharmacyName === pName.pharmacyName);
        return pharmacy.reduce((total, medCost) => total + medCost.copay, 0);
      
    };

    const pharmacyMedList = (medications) => {
        const pMedList = {};


        medications.forEach(med => {
            if (!pMedList[med.pharmacyName]) {
                pMedList[med.pharmacyName] = [];
            }
            pMedList[med.pharmacyName].push(med)
        });
       
        return pMedList;    
    }
   
    const pharmacyList = pharmacyMedList(costBreakdownData);

    //Redirects the user to that particular pharmacy order page once the user clicks the "click to order" button.
    const handleOrder = (url) => {
        if (!url) {
            console.error("URL is not defined");
            return;
        }

        // Open the pharmacy order page in a new tab
        window.open(url, '_blank');
    };
  
    return (
        <div className="p-container">
            

            <div className="p-content"> 
                <h2 className='h2-animation'>Pharmacy Prescription Details</h2>
                <div>
                    {message && <p>{message}</p>}
                </div>
                { Object.keys(pharmacyList).map((pName)=> (
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
                                        <th>Home Delivery</th>
                                    </tr>
                                </thead>

                                <tbody>   

                                    { pharmacyList[pName].map((medication,index) => (
                                        <tr key={index}>
                                            <td>{medication.medicationName}</td>
                                            <td>${medication.medicationCost}</td>
                                            <td>{medication.insurancePaidPercent}%</td>
                                            <td>${medication.copay.toFixed(2)}</td>  
                                            <td>{medication.homeDelivery === true ? "Available" : "Not available"}</td>    
                                        </tr>
                                    ))}
        
                                    <tr className="total-cost" >
                                        <td colSpan={4}>Total Cost</td>
                                        <td>${totalCost(pName).toFixed(2)}</td> 
                                    </tr>

                                </tbody>

                            </table>
                           
                            <div className="order-button">
                                <ReusableButton type="button" name={pName} onClick={() => handleOrder(pharmacyList[pName][0].pharmacyUrl)}>Click to order</ReusableButton>
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