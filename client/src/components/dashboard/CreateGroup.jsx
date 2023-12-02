import React, {useState,useEffect} from 'react'

const CreateGroup = (props) => {
  
  //Set states for group name
  const [group_name, setGroupname] = useState("");
  //Message to be displayed after editing
  const [msg,setMsg] = useState("");

   //Event handler on submitting create group
   const submit = async (e) => { 
    e.preventDefault();
    //Make API call to backend
    try{
        const api_call = `http://localhost:8000/api/creategroup/${group_name}`;
        const response = await fetch(api_call, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include', //To communicate cookies with server
        });
        console.log(response)
        //Check response status codes
        if(response.status=="400"){ //Bad Request - Password invalid
            setMsg("Enter group name!")
            throw new Error(`HTTP error! Status: ${response.status}`); }
        //Response statuscode - not in range 200-299 : Handle error 
        if (!response.ok) {
            setMsg("Couldn't create a group")
            throw new Error(`HTTP error! Status: ${response.status}`); }
        const resdata = await response.json(); //Response obtained from call
        setMsg("Your group details have been added Successfully!")
    }
    catch(error) //Catch the error
    {
      console.error('Error:', error);
    }
    }

  
  return (
    <div className='absolute left-[20%] w-[80%] h-[90%] pt-20 px-4 justify-center items-center'>
             <h3 className='text-5xl font-bold text-center pb-2 text-dark-blue'>CREATE GROUP - {props.role} </h3> 
            <h3 className='text-3xl font-serif font-bold text-center m-6 pb-2 text-dark-blue '>{msg}</h3> 
            <div className='w-[50%] h-[40%] absolute left-[22%] top-[25%] flex flex-col mt-20 m-6 shadow-xl shadow-slate-200 p-15 rounded-lg bg-logo-blue'>
                <h3 className='text-3xl font-serif font-bold text-center pt-6 text-white'>CREATE A GROUP</h3> 
                <form className='flex flex-col justify-center items-center p-4 text-center text-black text-bold text-xl'>
                    <div className='flex items-center'>
                        <span className='px-10 py-5 text-2xl text-white'> Group Name </span>
                        <input type="text" className='ml-2' onChange={e=>setGroupname(e.target.value)}/>
                    </div>    
                    <submit onClick={submit} className='bg-gray-light w-[150px] h-[50px] rounded-md text-2xl font-mono text-bold m-auto p-2 text-dark-blue border-2 border-blue-500 shadow-m shadow-slate-200 cursor-pointer hover:scale-105 hover:opacity-50'>
                        Create
                    </submit>
                </form> 
            </div>       
    </div>
  );
}

export default CreateGroup; 