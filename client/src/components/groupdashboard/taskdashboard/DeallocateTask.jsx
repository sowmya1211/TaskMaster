import React, {useState,useEffect} from 'react'

const DeallocateTask = (props) => {
  
  //Set states for group user details
  const group_name = props.group_name
  const task_name = props.task_name
  const [username, setUsername] = useState("");
  const [data, setData] = useState([]);
  const [initialRender, setInitialRender] = useState(true);
  //Message to be displayed
  const [msg,setMsg] = useState("");
  //On default - retrieve values from database and fill form
  useEffect(() => {
  const fetchData = async () => {
      try{ 
          const api_call = `http://localhost:8000/api/gettaskgroupuserdets/${group_name}/${task_name}`;
          const response = await fetch(api_call, { 
              method: 'GET', 
              headers: {'Content-Type': 'application/json'},
              credentials: 'include', //To communicate cookies with server
          });
          console.log(response)
          //Response statuscode - not in range 200-299 : Handle error
          if (!response.ok){
              setMsg("Couldnt Retrieve Task Details")
              throw new Error(`HTTP error! Status: ${response.status}`); //Code
          }    
          const resdata = await response.json(); //Response obtained from call
          console.log(resdata)
          setData(resdata)
        }
        catch(error) //Catch the error
        {
          setMsg("Couldnt Retrieve Task Details! Try after sometime")
          console.error('Error:', error);
        }
    };
  fetchData(); }, [initialRender]);

  //Event handler on submit
  const submit = async (e) => { 
    e.preventDefault();
    //Make API call to backend
    try{
        const api_call = `http://localhost:8000/api/deallocatetask/${group_name}/${task_name}/${username}`
        const response = await fetch(api_call, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include', //To communicate cookies with server
        });
        console.log(response)
        //Response statuscode - not in range 200-299 : Handle error
        if (!response.ok){
            setMsg("Couldnt Deallocate the Task from the user!")
            throw new Error(`HTTP error! Status: ${response.status}`); //Code
        }  
        setMsg("Task has been deallocated from User Successfully!")
        setInitialRender(false)
    }
    catch(error) //Catch the error
    { 
      console.error('Error:', error);
    }
}

  return (
    <div className='absolute left-[20%] w-[80%] h-[90%] pt-20 px-4 justify-center items-center'>
        <h3 className='text-4xl font-bold text-center pb-2 text-dark-blue'>DEALLOCATE TASK FROM USERS - {task_name} </h3> 
        <h3 className='text-xl font-serif font-bold text-center pb-1 text-dark-blue '>{msg}</h3> 
        <h3 className='text-xl font-bold text-center pb-1 text-dark-blue'>NOTE: Enter a user and click delete</h3> 
        <h3 className='text-xl font-bold text-center pb-1 text-dark-blue'>Entered user : {username}</h3> 
        <div className='w-[60%] h-[55%] absolute left-[18%] flex flex-col m-6 shadow-xl shadow-slate-200 p-8 rounded-lg bg-logo-blue max-h-150 overflow-y-auto'>
            <h3 className='text-3xl font-serif font-bold text-center pt-2 text-white'>USERS</h3> 
            <table className='justify-center items-center text-center text-white text-bold mt-6 '>
                    <tr className='text-2xl '>
                        <th className='p-3 border border-gray-300 w-1/2'>User Name</th>
                        <th className='p-3 border border-gray-300 w-1/2'>Full Name</th>
                    </tr>
                    {data && data.map((item) => (  
                    <tr key={item.username} className='text-xl text-white' >
                        <td  className="p-3 border border-gray-300 w-1/2">{item.username}</td>
                        <td  className="p-3 border border-gray-300 w-1/2">{item.fullname}</td>
                    </tr> 
                    ))} 
            </table>   
        </div>  
        <div className='absolute left-[20%] top-[80%] flex items-center m-20 mb-2 p-1'>
                    <span className='px-5 text-2xl text-dark-blue'> Username </span>
                    <input type="text" onChange={ e => setUsername(e.target.value)} className='bg-gray-light border-2 focus:bg-dark-blue focus:text-white'/>
                    <button onClick={submit} className='text-gray-light w-[150px] rounded-md text-2xl font-mono text-bold ml-3 p-2 bg-dark-blue border-2 border-blue-500 shadow-m shadow-slate-200 cursor-pointer hover:scale-105 hover:opacity-50'>
                    Deallocate </button> 
        </div>  
    </div>
  );
}

export default DeallocateTask; 