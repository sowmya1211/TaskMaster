import React, {useState,useEffect} from 'react'

const ViewAllDets = (props) => {

  const group_name = props.group_name
  
  const [msg, setMsg] = useState([]); 
  const [data, setData] = useState({
    task_users: [],
    tasks: [],
    other_users: [],
  });
  const [groupedData,setGroupedData] = useState([]);

  //On default - retrieve values from database and fill form
  useEffect(() => {
  const fetchData = async () => {
      try{
          const api_call = `http://localhost:8000/api/getgroupdets/${group_name}`;
          const response = await fetch(api_call, {
              method: 'GET', 
              headers: {'Content-Type': 'application/json'},
              credentials: 'include', //To communicate cookies with server
          });
          console.log(response) 
          //Response statuscode - not in range 200-299 : Handle error
          if (!response.ok){ 
              setMsg("Couldnt Retrieve the Details")
              throw new Error(`HTTP error! Status: ${response.status}`); //Code
          }    
          const resdata = await response.json(); //Response obtained from call
          console.log(resdata)
          setData(resdata)
          console.log(`Tasks: ${resdata.tasks}`)
          console.log(`Other users: ${resdata.other_users}`)
          console.log(`task users: ${resdata.task_users}`)
        }
        catch(error) //Catch the error
        {
          setMsg("Couldnt Retrieve the Details, Try after sometime")
          console.error('Error:', error);
        }
    };

  fetchData(); }, []);

  useEffect(() => {
    console.log(`Users and Tasks: ${data.task_users}`)
    console.log(data.tasks)
    const groupedTaskUsers = 
    data.task_users.reduce((acc, taskUser) => {
      if (!acc[taskUser.t_id]) {
        acc[taskUser.t_id] = { t_id: taskUser.t_id, task_lead_id: '',task_status:'', task_users: [] };
      }
      acc[taskUser.t_id].task_users.push(taskUser); 
      return acc;
    }, {});

    // Fill in task leads from tasks
    data.tasks.forEach((task) => {
      if (groupedTaskUsers[task.task_name]) {
        groupedTaskUsers[task.task_name].task_lead_id = task.task_lead_id;
        groupedTaskUsers[task.task_name].task_status = task.task_status;
      }
    });

    // Remove task users who are task leads
    Object.values(groupedTaskUsers).forEach((group) => {
      group.task_users = group.task_users.filter((user) => user.u_id !== group.task_lead_id);
    });

    // Convert grouped data to an array
    const groupedArray = Object.values(groupedTaskUsers);

    setGroupedData(groupedArray);
  }, [{data}]);

  
  return (
    <div className='absolute left-[20%] w-[80%] h-[90%] pt-20 px-4 justify-center items-center'>
            <h3 className='text-5xl font-bold text-center pb-2 text-dark-blue'>VIEW GROUP/TASK DETAILS - {props.group_role}</h3> 
            <h3 className='text-2xl font-serif font-bold text-center pb-1 text-dark-blue '>{msg}</h3> 
            <div className='w-[60%] h-[45%] absolute left-[18%] flex flex-col m-6 mb-4 shadow-xl shadow-slate-200 p-8 rounded-lg bg-logo-blue max-h-100 overflow-y-auto'>
                <h3 className='text-3xl font-serif font-bold text-center pt-2 text-white'>USERS WITH TASKS</h3> 
                <table className=' justify-center items-center text-center text-white text-bold '>
                        <tr className='text-2xl '>
                            <th className='p-5 border border-gray-300 w-1/4'>Task Name</th>
                            <th className='p-5 border border-gray-300 w-1/4'>Task Lead</th>
                            <th className='p-5 border border-gray-300 w-1/4'>Task Status</th>
                            <th className='p-5 border border-gray-300 w-1/4'>Assigned Users</th>
                        </tr> 
                        {groupedData && groupedData.map((task) => (
                          <tr key={task.t_id} className='text-xl'>
                            <td className="p-5 border border-gray-300 w-1/4">{task.t_id}</td>
                            <td className="p-5 border border-gray-300 w-1/4">{task.task_lead_id}</td>
                            <td className="p-5 border border-gray-300 w-1/4">{task.task_status}</td>
                            <td className="p-5 border border-gray-300 w-1/4">{task.task_users.map((user) => user.u_id).join(', ')}</td>
                          </tr>
                        ))}
                </table> 
            </div> 
            {data.other_users &&
            <div className='w-[40%] h-[30%] absolute left-[30%] top-[75%] flex flex-col m-4 shadow-xl shadow-slate-200 p-8 rounded-lg bg-logo-blue max-h-60 overflow-y-auto'>
                <h3 className='text-3xl font-serif font-bold text-center pt-2 text-white'>USERS WITHOUT TASKS</h3> 
                <table className=' justify-center items-center text-center text-white text-bold '>
                        <tr className='text-2xl '>
                            <th className='p-3 border border-gray-300 w-1'>User Name</th>
                        </tr> 
                        {data.other_users && data.other_users.map((user) => (
                          <tr key={user.u_id} className='text-xl'>
                            <td className="p-2 border border-gray-300 w-1/3">{user.u_id}</td>
                          </tr>
                        ))}
                </table> 
            </div> }
    </div>
  );
}

export default ViewAllDets; 