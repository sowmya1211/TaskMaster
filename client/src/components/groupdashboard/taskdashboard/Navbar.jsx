import React from 'react';
import logo from '../../../assets/logo.png';
import logouticon from '../../../assets/LogoutIcon.png';
import delaccicon from '../../../assets/DelAccntIcon.png';
import {useNavigate} from 'react-router-dom'

const Navbar = ({group_name,task_name,task_lead_id,username,fullname,setActiveComponent}) => {
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

  const DeleteTask = async () => {
    //Make API call to backend
    try{
      const api_call = `http://localhost:8000/api/deletetask/${group_name}/${task_name}`
      const response = await fetch(api_call, {
          method: 'DELETE',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include', //To communicate cookies with server
      });
      console.log(response)
      //Response statuscode - not in range 200-299 : Handle error
      if (!response.ok){
          window.alert("Couldnt Delete task! Check dependencies")
          throw new Error(`HTTP error! Status: ${response.status}`); //Code
      }  
      navigate(`/dashboard`, {state: {username:username,name:fullname,}})

    } 
    catch(error) //Catch the error
    { 
      window.alert("Couldnt Delete group! Check dependencies")
      console.error('Error:', error); 
    }
  };

  return (
    <div className='container flex justify-between fixed left-0 top-0 h-full w-[20%] bg-logo-blue'>
      <img className='h-[25%] w-full' src={logo} />
      <ul className={'fixed left-0 top-[25%] w-[20%]'}>
        {username==task_lead_id ? ( <li onClick={() => setActiveComponent('assigntask')} className="p-5 text-3xl font-bold text-white transition-opacity duration-300 ease-in-out hover:opacity-50 hover:cursor-pointer"> 
                            Assign Task</li>) : null}
        {username==task_lead_id ? ( <li onClick={() => setActiveComponent('deallocatetask')} className="p-5 text-3xl font-bold text-white transition-opacity duration-300 ease-in-out hover:opacity-50 hover:cursor-pointer"> 
                            Deallocate Task</li>) : null}
      </ul>
      <ul className={'fixed left-0 top-[80%] w-[20%]'}>
          {username==task_lead_id? (<li onClick={DeleteTask} className='flex items-center transition-opacity duration-300 ease-in-out hover:opacity-50 hover:cursor-pointer'>
                <span className='p-5 text-2xl text-white'>Delete Task </span>
                <img className=' mt-2 ml-6 h-[20%] w-[10%]' src={delaccicon} /></li>):null}
          <li onClick={Logout} className='flex items-center transition-opacity duration-300 ease-in-out hover:opacity-50 hover:cursor-pointer'>
                <span className='p-5 text-2xl text-white'>Log Out </span>
                <img className='ml-16 h-[20%] w-[10%]' src={logouticon} /></li>
      </ul>
    </div>   
  );
};

export default Navbar;