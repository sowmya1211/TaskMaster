import React from 'react';

const AddTask = ({setActiveComponent}) => {
    
    return (
        <div className='absolute top-[25%] right-[5%] p-10'>
            <button onClick={() => setActiveComponent('createtask')} className='bg-dark-blue w-[250px] rounded-md text-3xl font-mono text-bold my-6 mx-auto p-4 text-white border-4 border-double border-white shadow-m shadow-slate-200 hover:scale-105 hover:opacity-50'>
                Create Task
            </button>           
        </div>
    ); 
}; 
 
export default AddTask; 
