import React,{useState,useEffect} from 'react';

const Body = (props) => {

    //Set states for group task details
    const [data, setData] = useState([]);
    const [task_desc, setTaskDesc] = useState('');
    const [task_status, setTaskStatus] = useState('');
    const [report,setReport] = useState('');
    //Message to be displayed after retrieving values
    const [msg1,setMsg1] = useState("");
    const [msg2,setMsg2] = useState("");
    const [msg3,setMsg3] = useState("");
    //Retrieving task details
    const group_name = props.group_name
    const task_name = props.task_name
    const task_lead_id = props.task_lead_id
    const username = props.username

    const [initialRender, setInitialRender] = useState(true);
    //On default - retrieve values from database and fill table
    useEffect(() => {
        const fetchTaskData = async () => {
            try{ 
                const api_call = `http://localhost:8000/api/gettaskdets/${group_name}/${task_name}`;
                const response = await fetch(api_call, {
                    method: 'GET', 
                    headers: {'Content-Type': 'application/json'},
                    credentials: 'include', //To communicate cookies with server
                });
                console.log(response)
                //Response statuscode - not in range 200-299 : Handle error
                if (!response.ok){
                    setMsg1("There are no task members")
                    throw new Error(`HTTP error! Status: ${response.status}`); //Code
                }    
                const resdata = await response.json(); //Response obtained from call
                console.log(resdata)
                setTaskStatus(resdata.task_status)
                setTaskDesc(resdata.task_desc)
                } 
            catch(error) //Catch the error
             {
                setMsg1("There are no task members")
                console.error('Error:', error);
             }
         };
        const fetchTaskUserData = async () => {
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
                setMsg2("There are no task members")
                throw new Error(`HTTP error! Status: ${response.status}`); //Code
            }    
            const resdata = await response.json(); //Response obtained from call
            console.log(resdata)
            setData(resdata)
           }
        catch(error) //Catch the error
           {
            setMsg2("There are not task members")
            console.error('Error:', error);
            }
        };
        fetchTaskData(); 
        fetchTaskUserData(); 
    }, [initialRender]); 
   
    //Function to update user report
    const updatereport = async (e) => {
        e.preventDefault();
        //Make API call to backend
        try{
            const api_call = `http://localhost:8000/api/updatereport/${group_name}/${task_name}/${username}/${report}`
            const response = await fetch(api_call, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include', //To communicate cookies with server
            });
            console.log(response)
            //Response statuscode - not in range 200-299 : Handle error
            if (!response.ok){
                setMsg2("Couldn't update your report!")
                throw new Error(`HTTP error! Status: ${response.status}`); //Code
            }  
            setMsg2("Your Task Report has been updated Successfully!")
            setInitialRender(false)
        }
        catch(error) //Catch the error
        { 
          console.error('Error:', error);
        }
    }

    //Function to update user task status
    const updatestatus = async (e) => {
        e.preventDefault();
        //Make API call to backend
        try{
            const api_call = `http://localhost:8000/api/updatetaskstatus/${group_name}/${task_name}/${task_status}`
            const response = await fetch(api_call, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include', //To communicate cookies with server
            });
            console.log(response)
            //Response statuscode - not in range 200-299 : Handle error
            if (!response.ok){
                setMsg3("Couldn't update task status!")
                throw new Error(`HTTP error! Status: ${response.status}`); //Code
            }  
            setMsg3("Task Status has been updated Successfully!")
            setInitialRender(false)
        }
        catch(error) //Catch the error
        { 
          console.error('Error:', error);
        }
    }

    return (
        <div className='absolute left-[20%] w-[80%] h-[100%] py-28 px-4'>
            <div className='mt-0 flex-col justify-start text-dark-blue'> 
                <h1 className='md:text-5xl sm:text-5xl text-2xl font-bold'>
                Task Dashboard - {task_name}
                </h1>
                <p className='font-bold text-2xl p-1'>{msg1}</p>
                <p className='font-bold text-3xl p-2 flex-items-center text-center'> Task Description: {task_desc} </p>
                <p className='font-bold text-3xl p-0 flex-items-center text-center'>
                    <span className='px-12'>Task Lead: {task_lead_id} </span>
                    <span className='px-12'>Task Status: {task_status} </span>
                </p>    
            </div> 
            <div className='flex items-center mt-12'>
                <div className='w-[50%] h-[30%] relative left-[15%] shadow-xl shadow-slate-200 flex flex-col p-4 rounded-lg hover:scale-105 duration-300 bg-white'>
                    <h2 className='text-3xl font-bold text-center py-1'>Task Details</h2>
                    <p className='text-xl font-bold text-center p-1'>{msg2}</p>
                    <div className='m-4 text-center text-2xl text-bold font-sans max-h-56 overflow-y-auto '>
                    <table className='relative left-[10%] justify-center items-center text-center text-dark-blue text-bold '>
                        <tr className='text-xl '>
                            <th className='p-2 border border-gray-300 w-1/2'>Task Member</th>
                            <th className='p-2 border border-gray-300 w-1/2'>Report</th>
                        </tr>
                        {data && data.map((item) => ( 
                        <tr key={item.username} className='text-l hover:scale-105 hover:opacity-50 hover:bg-logo-blue hover:text-white cursor-pointer'>
                            <td  className="p-1 border border-gray-300 w-1/2">{item.username}</td>
                            <td className="p-1 border border-gray-300 w-1/2">{item.report}</td>
                        </tr> ))}
                    </table>
                    </div >  
                     <div className='relative left-[2%] top-[60%] flex items-center m-6 mb-2 p-1'>
                        <span className='px-5 text-2xl text-dark-blue'> Update Your Report </span>
                        <input type="text" onChange={ e => setReport(e.target.value)} className='bg-gray-light border-2 focus:bg-dark-blue focus:text-white'/>
                        <button onClick={updatereport} className='text-gray-light w-[150px] rounded-md text-2xl font-mono text-bold ml-3 p-2 bg-dark-blue border-2 border-blue-500 shadow-m shadow-slate-200 cursor-pointer hover:scale-105 hover:opacity-50'>
                        Update </button> 
                    </div> 
                </div>

                { username==task_lead_id &&
                <div className='max-w-[30%] relative left-[20%] shadow-2xl shadow-slate-200 flex flex-col p-1 rounded-lg hover:scale-105 duration-300 bg-pale-blue border-4 border-double border-stone-950'>
                     <h2 className='text-3xl font-bold text-center py-1'>Update Task Status</h2>
                     <p className='text-xl font-bold text-center p-1'>{msg3}</p>
                    <div className='flex justify-center items-center py-8' >
                        <select onChange={e => setTaskStatus(e.target.value)} className="border-2 text-black px-6 py-2">
                            <option value="" disabled selected> Select Status </option>
                            <option >Open</option>
                            <option >In Progress</option>
                            <option >On Hold</option>
                            <option >Cancelled</option>
                            <option >Completed</option>
                        </select>
                    </div>
                    <div className='flex justify-center items-center pb-6'> 
                        <button onClick={updatestatus} className='text-gray-light w-[150px] rounded-md text-2xl font-mono text-bold ml-3 p-2 bg-dark-blue border-2 border-blue-500 shadow-m shadow-slate-200 cursor-pointer hover:scale-105 hover:opacity-50'>
                        Update </button> 
                    </div>     
                </div>}
            </div>    
        </div>
    );
};

export default Body;