import React from 'react';
import "../retangle_options.css"
import ImageBtnDesc from '../images/'


const retangle_options1 = () => {
    return(
        <div className='container-1'>
            <img src={ImageBtnDesc} alt="img" />
            <button className='btn'></button>
            <button className='btn'></button>
        </div>
    )
}

export default retangle_options1;