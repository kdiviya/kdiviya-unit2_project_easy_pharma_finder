import React from 'react';

//create reusable button component that used in other components, instead of creating button for each page.
const ReusableButton = ({children, type, id, name, onClick}) => {

    return(
        <button type={type} id={id} name={name} onClick={onClick}>
            {children}
        </button>
    );
    
};

export default ReusableButton;