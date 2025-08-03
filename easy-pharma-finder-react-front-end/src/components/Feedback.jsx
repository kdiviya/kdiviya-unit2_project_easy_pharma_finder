import { useEffect, useState } from 'react';
import Footer from './Footer';
import ReusableButton from './ReusableButton';
import './css/feedback.css';

import { useLocation } from 'react-router-dom';

//Display the feedback form for the users.
const Feedback = () => {

    const [isFormVisible, setIsformVisible] = useState(true); //store the form visible status based on the submit button
    const location = useLocation(); //store the path name to location variable
   

    //check if current page is /feedback and made the feedback visible to users.
    useEffect(() => {
        location.pathname === "/feedback" && setIsformVisible(true);
    },[location]);

    //After clicking the submit button, set the form visbility to false to display the user friendly message.
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsformVisible(false);
    }

    // This JSX structure follows proper HTML document formatting. When transpiled, it generates valid HTML with semantic tags.
    return (
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
