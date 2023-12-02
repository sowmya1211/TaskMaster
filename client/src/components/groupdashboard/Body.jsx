import React,{useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom'

const Body = (props) => {

    const navigate = useNavigate() //To navigate to group dashboard
    //Set states for group task details
    const [data, setData] = useState([]);
    const [initialRender, setInitialRender] = useState(true);
    //Message to be displayed after retrieving values
    const [msg,setMsg] = useState("");
    //Retrieving group details
    const group_name = props.group_name
    const group_admin_id = props.group_admin_id
    const group_role_name = props.group_role_name

    //On default - retrieve values from database and fill table
    useEffect(() => {
    const fetchData = async () => {
        try{
            const api_call = `http://localhost:8000/api/getgroupusertaskdets/${group_name}`;
            const response = await fetch(api_call, {
                method: 'GET', 
                headers: {'Content-Type': 'application/json'},
                credentials: 'include', //To communicate cookies with server
            });
            console.log(response)
            //Response statuscode - not in range 200-299 : Handle error
            if (!response.ok){
                setMsg("You aren't a part of any task")
                throw new Error(`HTTP error! Status: ${response.status}`); //Code
            }    
            const resdata = await response.json(); //Response obtained from call
            console.log(resdata)
            setData(resdata)
            setInitialRender(false)
            } 
            catch(error) //Catch the error
            {
            setMsg("You aren't a part of any task")
            console.error('Error:', error);
            }
        };
        fetchData(); }, [initialRender]); 
    const fullname = props.fullname
    const username = props.username
    //To navigate to task dashboard on clicking on a task detail
    const handleTaskRowClick = (task_name, task_lead_id, task_desc,task_status) => {
        navigate('/taskdashboard', {
            state: {group_name, task_name, task_lead_id, task_desc,task_status,fullname,username,} });
    };
    return (
        <div className='absolute left-[20%] w-[80%] h-[100%] py-28 px-4'>
            <div className='mt-0 flex-col justify-start text-dark-blue'> 
                <h1 className='md:text-7xl sm:text-6xl text-2xl font-bold'>
                Group Dashboard - {group_name}
                </h1>
                <p className='font-bold text-3xl p-2'> Group Role: {group_role_name} </p>
                <p className='font-bold text-3xl p-2'> Group Admin: {group_admin_id} </p> 
            </div> 
            <div className='flex items-center mt-16'>
                <div className='w-[60%] relative left-[22%] shadow-xl shadow-slate-200 flex flex-col p-4 rounded-lg hover:scale-105 duration-300 bg-white'>
                    <h2 className='text-3xl font-bold text-center py-4'>Your Tasks</h2>
                    <p className='text-xl font-bold text-center p-2'>{msg}</p>
                    <div className='m-4 text-center text-2xl text-bold font-sans max-h-120 overflow-y-auto '>
                    <table className='relative left-[18%] justify-center items-center text-center text-dark-blue text-bold '>
                        <tr className='text-xl '>
                            <th className='p-4 border border-gray-300 w-1/3'>Task Name</th>
                            <th className='p-4 border border-gray-300 w-1/3'>Task Lead</th>
                            <th className='p-4 border border-gray-300 w-1/3'>Task Status</th>
                        </tr>
                        {data && data.map((item) => ( 
                        <tr key={item.task_name} className='text-l hover:scale-105 hover:opacity-50 hover:bg-logo-blue hover:text-white cursor-pointer'
                            onClick={() => handleTaskRowClick( item.task_name, item.task_lead_id,item.task_desc,item.task_status)} >
                            <td  className="p-2 border border-gray-300 w-1/3">{item.task_name}</td>
                            <td className="p-2 border border-gray-300 w-1/3">{item.task_lead_id}</td>
                            <td className="p-2 border border-gray-300 w-1/3">{item.task_status}</td>
                        </tr> ))}
                    </table>
                    </div>           
                </div>
            </div> 
        </div>
    );
};

export default Body;