import React from 'react';

const AddGrp = ({setActiveComponent}) => {
    
    return (
        <div className='absolute top-[18%] right-[6%] p-10'>
            <button onClick={() => setActiveComponent('creategroup')} className='bg-dark-blue w-[250px] rounded-md text-3xl font-mono text-bold my-6 mx-auto p-4 text-white border-4 border-double border-white shadow-m shadow-slate-200 hover:scale-105 hover:opacity-50'>
                Create Group
            </button>           
        </div>
    );
};
 
export default AddGrp; 
