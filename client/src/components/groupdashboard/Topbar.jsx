import React from 'react';
import {useNavigate} from 'react-router-dom'

const Topbar = ({fullname,username,group_name,setActiveComponent}) => {

    const navigate = useNavigate() //To navigate to group dashboard
    return (
        <div className='container flex flex-row justify-between absolute top-0 right-0 h-[10%] w-[80%] z-10 bg-[#d9d9d9]'>
          <div onClick={() => setActiveComponent('maingroupdashboard')} className="cursor-pointer absolute left-30 p-4 flex flex-row items-center text-3xl text-gray-blue transition-opacity duration-300 ease-in-out hover:opacity-50  "> GROUP PAGE </div>
          <div onClick={() => navigate(`/dashboard`, {state: {username:username,name:fullname,}} )} className="cursor-pointer absolute left-60 p-4 flex flex-row items-center text-3xl text-gray-blue transition-opacity duration-300 ease-in-out hover:opacity-50  "> HOME </div>
          <div className="absolute left-[40%] p-4 flex flex-row items-center text-4xl text-bold text-gray-blue transition-opacity duration-300 ease-in-out hover:opacity-50  "> {group_name} </div>
          <div className="absolute right-0 p-1 flex flex-row items-center " > 
                <div className='p-3 text-3xl text-gray-blue transition-opacity duration-300 ease-in-out hover:opacity-50 no-underline hidden md:block lg:block'>{fullname}</div>
          </div>  
        </div>  
    );
};

export default Topbar; 


