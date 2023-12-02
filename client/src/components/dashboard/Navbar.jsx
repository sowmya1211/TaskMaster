import React from 'react';
import logo from '../../assets/logo.png';
import logouticon from '../../assets/LogoutIcon.png';
import delaccicon from '../../assets/DelAccntIcon.png';
import {useNavigate} from 'react-router-dom'

const Navbar = ({perms,username,setActiveComponent}) => {
  const navigate = useNavigate();
  const Logout = async () => {
      //Make API call to backend
      try{
          const api_call = `http://localhost:8000/api/logout`;
          const response = await fetch(api_call, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              credentials: 'include', //To communicate cookies with server
          });
          console.log(response)
          //Response statuscode - not in range 200-299 : Handle error
          if (!response.ok) 
              throw new Error(`HTTP error! Status: ${response.status}`); //Code
          navigate("/")
      }
      catch(error) //Catch the error
      {
        window.alert("Cannot logout user")
        console.error('Logout Error:', error);
      }
  };

  const Deactivate = async () => {
    //Make API call to backend
    try{
      const api_call = `http://localhost:8000/api/delaccnt/${username}`
      const response = await fetch(api_call, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include', //To communicate cookies with server
      });
      console.log(response)
      //Response statuscode - not in range 200-299 : Handle error
      if (!response.ok){
          window.alert("Couldnt Deactivate User's account! User has other dependencies")
          throw new Error(`HTTP error! Status: ${response.status}`); //Code
      }  
      navigate("/")

    } 
    catch(error) //Catch the error
    { 
      window.alert("Couldnt Deactivate User's account! User has other dependencies")
      console.error('Error:', error);
    }
  };

  return (
    <div className='container flex justify-between fixed left-0 top-0 h-full w-[20%] bg-logo-blue'>
      <img className='h-[25%] w-full' src={logo} />
      <ul className={'fixed left-0 top-[25%] w-[20%]'}>
        {perms.reg_user ? ( <li onClick={() => setActiveComponent('reguser')} className="p-5 text-3xl font-bold text-white transition-opacity duration-300 ease-in-out hover:opacity-50 hover:cursor-pointer"> 
                            Register Users</li>) : null}
        {perms.view_dets ? ( <li onClick={() => setActiveComponent('viewdets')} className="p-5 text-3xl font-bold text-white transition-opacity duration-300 ease-in-out hover:opacity-50 hover:cursor-pointer"> 
                            View Details</li>) : null}
        {perms.delete_users ? ( <li onClick={() => setActiveComponent('deluser')} className="p-5 text-3xl font-bold text-white transition-opacity duration-300 ease-in-out hover:opacity-50 hover:cursor-pointer"> 
                            Delete Users</li>) : null}
        {perms.delete_groups ? ( <li onClick={() => setActiveComponent('delgroup')} className="p-5 text-3xl font-bold text-white transition-opacity duration-300 ease-in-out hover:opacity-50 hover:cursor-pointer"> 
                            Delete Groups</li>) : null}
      </ul>
      <ul className={'fixed left-0 top-[80%] w-[20%]'}>
          <li onClick={Deactivate} className='flex items-center transition-opacity duration-300 ease-in-out hover:opacity-50 hover:cursor-pointer'>
                <span className='p-5 text-2xl text-white'>Deactivate </span>
                <img className='ml-3 mt-2 h-[20%] w-[10%]' src={delaccicon} /></li>
          <li onClick={Logout} className='flex items-center transition-opacity duration-300 ease-in-out hover:opacity-50 hover:cursor-pointer'>
                <span className='p-5 text-2xl text-white'>Log Out </span>
                <img className='ml-10 h-[20%] w-[10%]' src={logouticon} /></li>
      </ul>
    </div>   
  );
};

export default Navbar;