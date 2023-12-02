import React, {useState,useEffect} from 'react'

const CreateTask = (props) => {
  
  const group_name = props.group_name
  //Set states for task details
  const [task_name, setTaskname] = useState("");
  const [task_desc, setTaskdesc] = useState("");
  //Message to be displayed after editing
  const [msg,setMsg] = useState("");

   //Event handler on submitting create task
   const submit = async (e) => { 
    e.preventDefault(); 
    //Make API call to backend
    try{
        const api_call = `http://localhost:8000/api/createtask/${group_name}/${task_name}/${task_desc}`;
        const response = await fetch(api_call, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include', //To communicate cookies with server
        });
        console.log(response)
        //Check response status codes
        if(response.status=="400"){ //Bad Request - Password invalid
            setMsg("Enter task details properly!")
            throw new Error(`HTTP error! Status: ${response.status}`); }
        //Response statuscode - not in range 200-299 : Handle error 
        if (!response.ok) {
            setMsg("Couldn't create a task")
            throw new Error(`HTTP error! Status: ${response.status}`); }
        const resdata = await response.json(); //Response obtained from call
        setMsg("Your task details have been added Successfully!")
    }
    catch(error) //Catch the error
    {
      console.error('Error:', error);
    }
    }

  
  return (
    <div className='absolute left-[20%] w-[80%] h-[90%] pt-20 px-4 justify-center items-center'>
             <h3 className='text-5xl font-bold text-center pb-2 text-dark-blue'>CREATE TASK - {props.group_role} </h3> 
            <h3 className='text-3xl font-serif font-bold text-center m-6 pb-2 text-dark-blue '>{msg}</h3> 
            <div className='w-[60%] h-[50%] absolute left-[20%] top-[25%] flex flex-col mt-20 m-6 shadow-xl shadow-slate-200 p-15 rounded-lg bg-logo-blue'>
                <h3 className='text-3xl font-serif font-bold text-center pt-6 text-white'>CREATE A TASK</h3> 
                <form className='flex flex-col justify-center items-center p-4 text-center text-black text-bold text-xl'>
                    <div className='flex items-center'>
                        <span className='px-16 py-4 text-2xl text-white'> Task Name </span>
                        <input type="text" className='ml-16' onChange={e=>setTaskname(e.target.value)}/>
                    </div>   
                    <div className='flex items-center'>
                        <span className='px-16 py-4 text-2xl text-white'> Task Description </span>
                        <input type="text" className='ml-2' onChange={e=>setTaskdesc(e.target.value)}/>
                    </div>    
                    <submit onClick={submit} className='bg-gray-light w-[150px] h-[50px] rounded-md text-2xl font-mono text-bold m-auto p-2 text-dark-blue border-2 border-blue-500 shadow-m shadow-slate-200 cursor-pointer hover:scale-105 hover:opacity-50'>
                        Create
                    </submit>
                </form> 
            </div>       
    </div>
  );
}

export default CreateTask; 