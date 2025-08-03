import { useEffect, useState } from 'react';
import Footer from './Footer';
import ReusableButton from './ReusableButton';
import './css/feedback.css';

import { useLocation } from 'react-router-dom';

const Feedback = () => {

    const [isFormVisible, setIsformVisible] = useState(true);
    const location = useLocation();

    useEffect(() => {
        location.pathname === "/feedback" && setIsformVisible(true);
    },[location]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsformVisible(false);

    }

    return(

            <div className="container">
                {isFormVisible ? (
                    <div className="content">
                        <h2 className='h2-animation'>Feedback Form </h2>
                        <form className = "feedback" onSubmit={handleSubmit}>
                        
                            <label>Name </label>
                            <input type="text" id="name" name="name"></input>
                            <label>Email </label>
                            <input type="email" id="email" name="email" ></input>

                            <label>Comments</label>
                            <textarea id="comments" name="comments" rows="10" placeholder="Enter your comments!!!" />
                            <ReusableButton id="fb-submit" type="submit" name="submit">Submit</ReusableButton>
                        </form> 
                    </div>)
                    :
                    (<div className='message'>
                        <p>Thank you for your feedback! We really appreciate you taking the time to help us improve Easy Pharma Finder.</p>     
                    </div>) 
                }           
                <Footer />        
            </div>
          
    
    )

}

export default Feedback;
