import React,{useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom'

const Body = (props) => {

    const navigate = useNavigate() //To navigate to group dashboard
    //Set states for retrieving details
    const [data, setData] = useState([]);
    const [initialRender, setInitialRender] = useState(true);
    //Message to be displayed after retrieving values
    const [msg,setMsg] = useState("");
    //On default - retrieve values from database and fill table
    useEffect(() => {
    const fetchData = async () => {
        try{
            const api_call = `http://localhost:8000/api/getusergroupdets`;
            const response = await fetch(api_call, {
                method: 'GET', 
                headers: {'Content-Type': 'application/json'},
                credentials: 'include', //To communicate cookies with server
            });
            console.log(response)
            //Response statuscode - not in range 200-299 : Handle error
            if (!response.ok){
                setMsg("You aren't a part of any group")
                throw new Error(`HTTP error! Status: ${response.status}`); //Code
            }    
            const resdata = await response.json(); //Response obtained from call
            console.log(resdata)
            setData(resdata)
            setInitialRender(false)
            } 
            catch(error) //Catch the error
            {
            setMsg("You aren't a part of any group") 
            console.error('Error:', error); 
            }
        };
        fetchData(); }, [initialRender]);
    
    const fullname = props.fullname
    console.log(fullname)
    const username = props.username
    //To navigate to group dashboard on clicking on a group detail
    const handleGroupRowClick = (group_name, group_admin_id, group_role_name) => {
        navigate('/groupdashboard', {
            state: { group_name, group_admin_id, group_role_name, fullname, username}});
    };

    //Get current date
    const currentDate = new Date(); 
    const formattedDate = currentDate.toDateString();
    
    return (
        <div className='absolute left-[20%] w-[80%] h-[100%] py-28 px-4'> 
            <div className='mt-0 flex-col justify-start text-dark-blue'> 
                <h1 className='md:text-7xl sm:text-6xl text-2xl font-bold'>
                Dashboard - {props.role}
                </h1>
                <p className='font-bold text-xl p-2'> {formattedDate} </p> 
            </div> 
            <div className='flex items-center mt-12'>
                <div className='w-[40%] relative left-[15%] shadow-xl shadow-slate-200 flex flex-col p-4 rounded-lg hover:scale-105 duration-300 bg-white'>
                    <h2 className='text-3xl font-bold text-center py-2'>Your Groups</h2>
                    <p className='text-xl font-bold text-center p-1'>{msg}</p>
                    <div className='m-4 text-center text-2xl text-bold font-sans max-h-64 overflow-y-auto '>
                    <table className=' justify-center items-center text-center text-dark-blue text-bold '>
                        <tr className='text-xl '>
                            <th className='p-2 border border-gray-300 w-1/3'>Group Name</th>
                            <th className='p-2 border border-gray-300 w-1/3'>Group Admin</th>
                            <th className='p-2 border border-gray-300 w-1/3'>Group Role</th>
                        </tr>
                        {data && data.map((item) => ( 
                        <tr key={item.group_name} className='text-l hover:scale-105 hover:opacity-50 hover:bg-logo-blue hover:text-white cursor-pointer'
                            onClick={() => handleGroupRowClick( item.group_name, item.group_admin_id,item.group_role_name)} >
                            <td  className="p-1 border border-gray-300 w-1/3">{item.group_name}</td>
                            <td className="p-1 border border-gray-300 w-1/3">{item.group_admin_id}</td>
                            <td className="p-1 border border-gray-300 w-1/3">{item.group_role_name}</td>
                        </tr> ))}
                    </table>
                    </div>          
                </div>

                <div className='max-w-[25%] relative left-[30%] shadow-2xl shadow-slate-200 flex flex-col p-1 rounded-lg hover:scale-105 duration-300 bg-pale-blue border-4 border-double border-stone-950'>
                <h2 className='text-2xl font-bold text-center py-2'>Your Tasks</h2>
                    <div className='text-center text-bold font-serif'>
                    <li className='flex items-center py-2 border-b mx-2'>
                        <span className='p-5 text-xl text-dark-blue mr-6'>Pending: </span>
                        <span className='p-5 text-2xl text-blue'>2 </span>
                    </li> 
                    <li className='flex items-center py-1 mx-2'>
                        <span className='p-5 text-xl text-dark-blue'>Completed: </span>
                        <span className='p-5 text-2xl text-blue'>5 </span>
                    </li>
                    </div> 
                </div>
            </div>
        </div>
    );
};

export default Body;