import React, {useState,useEffect} from 'react'

const DeleteGroup = (props) => {
  
  //Set states for profile details
  const [group_name, setGroupname] = useState("");
  const [data, setData] = useState([]);
  const [initialRender, setInitialRender] = useState(true);
  //Message to be displayed 
  const [msg,setMsg] = useState("");
  //On default - retrieve values from database and fill form
  useEffect(() => {
  const fetchData = async () => {
      try{ 
          const api_call = `http://localhost:8000/api/getallgroupdets`;
          const response = await fetch(api_call, {
              method: 'GET', 
              headers: {'Content-Type': 'application/json'},
              credentials: 'include', //To communicate cookies with server
          });
          console.log(response)
          //Response statuscode - not in range 200-299 : Handle error
          if (!response.ok){
              setMsg("Couldnt Retrieve Group Details")
              throw new Error(`HTTP error! Status: ${response.status}`); //Code
          }    
          const resdata = await response.json(); //Response obtained from call
          console.log(resdata)
          setData(resdata)
        }
        catch(error) //Catch the error
        {
          setMsg("Couldnt Retrieve Group Details! Try after sometime")
          console.error('Error:', error);
        }
    };
  fetchData(); }, [initialRender]);

  //Event handler on submit
  const submit = async (e) => {
    e.preventDefault();
    //Make API call to backend
    try{
        const api_call = `http://localhost:8000/api/deletegroup/${group_name}`
        const response = await fetch(api_call, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include', //To communicate cookies with server
        });
        console.log(response)
        //Response statuscode - not in range 200-299 : Handle error
        if (!response.ok){
            setMsg("Couldnt Delete Group")
            throw new Error(`HTTP error! Status: ${response.status}`); //Code
        }  
        setMsg("Group has been deleted Successfully!")
        setInitialRender(false)
    }
    catch(error) //Catch the error
    { 
      console.error('Error:', error);
    }
}

  return (
    <div className='absolute left-[20%] w-[80%] h-[90%] pt-20 px-4 justify-center items-center'>
        <h3 className='text-4xl font-bold text-center pb-2 text-dark-blue'>DELETE GROUPS - {props.role}</h3> 
        <h3 className='text-xl font-serif font-bold text-center pb-1 text-dark-blue '>{msg}</h3> 
        <h3 className='text-xl font-bold text-center pb-1 text-dark-blue'>NOTE: Enter a group and click delete</h3> 
        <h3 className='text-xl font-bold text-center pb-1 text-dark-blue'>Entered group : {group_name}</h3> 
        <div className='w-[60%] h-[55%] absolute left-[18%] flex flex-col m-6 shadow-xl shadow-slate-200 p-8 rounded-lg bg-logo-blue max-h-150 overflow-y-auto'>
            <h3 className='text-3xl font-serif font-bold text-center pt-4 text-white'>GROUPS</h3> 
            <table className='justify-center items-center text-center text-white text-bold mt-6 '>
                    <tr className='text-2xl '>
                        <th className='p-5 border border-gray-300 w-1/2'>Group Name</th>
                        <th className='p-5 border border-gray-300 w-1/2'>Group Admin</th>
                    </tr>
                    {data && data.map((item) => (  
                    <tr key={item.group_name} className='text-xl text-white' >
                        <td  className="p-3 border border-gray-300 w-1/2">{item.group_name}</td>
                        <td className="p-3 border border-gray-300 w-1/2">{item.group_admin_id}</td>
                    </tr> 
                    ))}
           </table>   
            </div>  
            <div className='absolute left-[20%] top-[80%] flex items-center m-20 mb-2 p-1'>
                        <span className='px-5 text-2xl text-dark-blue'> Group name </span>
                        <input type="text" onChange={ e => setGroupname(e.target.value)} className='bg-gray-light border-2 focus:bg-dark-blue focus:text-white'/>
                        <button onClick={submit} className='text-gray-light w-[150px] rounded-md text-2xl font-mono text-bold ml-3 p-2 bg-dark-blue border-2 border-blue-500 shadow-m shadow-slate-200 cursor-pointer hover:scale-105 hover:opacity-50'>
                        Delete </button> 
            </div>       
    </div>
  );
}

export default DeleteGroup; 