import React, {useState} from 'react'
import logo from "../assets/logo.png" 
import Footer from '../components/Footer'
import {useNavigate} from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate()
    //Set states for variables
    const [username, setUname] = useState('');
    const [password, setPassword] = useState('');
    const [errormsg, setErrormsg] = useState('');

    //Event handler on submit 
    const submit = async () => {
        //Make API call to backend
        try{
            const api_call = `http://localhost:8000/api/login/${username}/${password}`;
            const response = await fetch(api_call, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include', //To communicate cookies with server
                body: JSON.stringify({
                    username,
                    password
                })
            });
            console.log(response)
            //Check response status codes
            if(response.status=="404" || response.status=="500"){ //Status not found - Username invalid
                setErrormsg("User is not found!")
                throw new Error(`HTTP error! Status: ${response.status}`); }
            else if(response.status=="400"){ //Bad Request - Password invalid
                setErrormsg("Incorrect Password!")
                throw new Error(`HTTP error! Status: ${response.status}`); }
            else  setErrormsg("")
            //Response statuscode - not in range 200-299 : Handle error 
            if (!response.ok) {
                setErrormsg("Server Down! Try after sometime")
                throw new Error(`HTTP error! Status: ${response.status}`); }
            const resdata = await response.json(); //Response obtained from call
            const name = resdata.fullname
            navigate(`dashboard`, {state: {username, name}} );  // Navigate to the dashboard route with the updated name
        }
        catch(error) //Catch the error
        { 
          console.error('Error:', error);
        }
    }

    return (
        <>
            <div className='m-auto py-28 px-10'>
                <div className='container flex justify-between fixed left-0 top-0 h-full w-[40%]'>
                    <img className='h-full w-full' src={logo} />
                </div>
                <div className='flex flex-col justify-center items-center fixed left-[40%] top-0 w-[60%] h-full m-[4 rem]'>
                <h3 className='text-3xl font-serif font-bold text-center pb-10 text-black'>{errormsg}</h3> 
                    <div className='w-[60%] h-[60%] flex flex-col m-10 shadow-xl shadow-slate-200 p-8 rounded-lg bg-logo-blue'>
                        <h3 className='text-5xl font-serif font-bold text-center pt-12 text-white'>WELCOME</h3> 
                        <div method="post" name='loginForm' className='flex flex-col justify-center items-center p-4 text-center text-black text-bold text-xl'>
                            <div className='flex items-center'>
                                <span className='p-5 text-2xl text-white'> Username </span>
                                <input type="text" required placeholder="Enter username" className='text-xl'
                                        onChange={e => setUname(e.target.value)} />
                            </div> 
                            <div className='flex items-center'>
                                <span className='p-5 text-2xl text-white'> Password </span>
                                <input type="password" required placeholder="Enter password" className='text-xl'
                                        onChange={e => setPassword(e.target.value)} />
                            </div>     
                            <button onClick={submit} className='bg-gray-light w-[100px] rounded-md text-2xl font-mono text-bold m-auto p-2 mt-4 text-dark-blue border-2 border-blue-500 shadow-m shadow-slate-200 hover:scale-105 hover:opacity-50'>
                                Login
                            </button>
                        </div> 
                    </div>       
                </div>  
            </div>
            <Footer />
        </>
    )
}  
export default Login