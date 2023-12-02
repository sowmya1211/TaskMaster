import React, { useState } from 'react';
import userlogo from '../../assets/UserAccntIcon.png';

const Topbar = ({fullname,setActiveComponent}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => { 
        setIsMenuOpen(!isMenuOpen);
    };
  
    return (
        <div className='container flex flex-row justify-between absolute top-0 right-0 h-[10%] w-[80%] z-10 bg-[#d9d9d9]'>
          <div onClick={() => setActiveComponent('maindashboard')} className="cursor-pointer absolute left-30 p-4 flex flex-row items-center text-3xl text-gray-blue transition-opacity duration-300 ease-in-out hover:opacity-50  "> HOME </div>
          <div className="absolute right-0 p-1 flex flex-row items-center " onMouseLeave={toggleMenu}>
                  <img  className='inline-block h-10 w-10 rounded-full' src={userlogo} alt="" />
                  <a href="#" onMouseEnter={toggleMenu} id="UserNameProfile" className='p-3 text-3xl text-gray-blue transition-opacity duration-300 ease-in-out hover:opacity-50 hover:cursor-pointer no-underline hidden md:block lg:block'>{fullname}</a>
                  {isMenuOpen && ( 
                  <div className="rounded shadow-md fixed mt-120 mr-1 right-0 bg-[#d9d9d9] border-2 border-white items-center"> 
                    <ul className="py-2 list-reset items-center">
                    <li onClick={() => setActiveComponent('userprofile')} className="p-3 text-xl text-gray-blue transition-opacity duration-300 ease-in-out hover:opacity-50 hover:cursor-pointer no-underline"> View Profile </li>
                    </ul>
                  </div>
                )}       
          </div>  
        </div>  
    );
};

export default Topbar;


