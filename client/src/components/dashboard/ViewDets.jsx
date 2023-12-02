import React, {useState,useEffect} from 'react'

const ViewDets = (props) => {
  
  const [msg, setMsg] = useState([]); 
  const [data, setData] = useState([]); // Replace with your JSON data
  const [groupedData, setGroupedData] = useState({}); // State to store grouped data

  //On default - retrieve values from database and fill form
  useEffect(() => {
  const fetchData = async () => {
      try{
          const api_call = `http://localhost:8000/api/getalldets`;
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
         
        }
        catch(error) //Catch the error
        {
          setMsg("Couldnt Retrieve the Details, Try after sometime")
          console.error('Error:', error);
        }
    };

  fetchData(); }, []);


  // Function to group data by 'g_id'
  const groupDataByGId = (data) => {
    return data.reduce((groups, item) => {
      const groupId = item.g_id;

      if (!groups[groupId]) {
        groups[groupId] = [];
      }

      groups[groupId].push(item);
      return groups;
    }, {});
  };

  // Function to find group admins and other users
  const FindGroupAdminsandUsers = (groupedData) => {
    const GroupAdminandUsers = {};
    for (const groupId in groupedData) {
      const group = groupedData[groupId];
      const admins = group.filter((item) => item.group_role === 'GR_1');
      const otherUsers = group.filter((item) => item.group_role !== 'GR_1');

      GroupAdminandUsers[groupId] = {admins,otherUsers};
    }
    return GroupAdminandUsers; };

  useEffect(() => {
    // Assuming 'data' is your JSON data
    const groupedData = groupDataByGId(data);
    const GroupDatawithAdminsandUsers = FindGroupAdminsandUsers(groupedData);
    setGroupedData(GroupDatawithAdminsandUsers);
  }, [data]);

  

  return (
    <div className='absolute left-[20%] w-[80%] h-[90%] pt-20 px-4 justify-center items-center'>
            <h3 className='text-5xl font-bold text-center pb-2 text-dark-blue'>VIEW GROUP/USER DETAILS - {props.role}</h3> 
            <h3 className='text-2xl font-serif font-bold text-center pb-1 text-dark-blue '>{msg}</h3> 
            <div className='w-[60%] h-[70%] absolute left-[18%] flex flex-col m-6 mb-10 shadow-xl shadow-slate-200 p-8 rounded-lg bg-logo-blue max-h-120 overflow-y-auto'>
                <h3 className='text-3xl font-serif font-bold text-center pt-2 text-white'>DETAILS</h3> 
                <table className=' justify-center items-center text-center text-white text-bold '>
                        <tr className='text-2xl '>
                            <th className='p-5 border border-gray-300 w-1/3'>Group Name</th>
                            <th className='p-5 border border-gray-300 w-1/3'>Group Admin</th>
                            <th className='p-5 border border-gray-300 w-1/3'>Group Users</th>
                        </tr> 
                        {Object.keys(groupedData).map((groupId) => (
                            <tr key={groupId} className='text-xl'>
                            <td  className="p-5 border border-gray-300 w-1/3">{groupId}</td>
                            <td className="p-5 border border-gray-300 w-1/3">
                                {groupedData[groupId].admins.map((admin) => (
                                <div key={admin.u_id}>{admin.u_id}</div>
                                ))}
                            </td>
                            <td className="p-5 border border-gray-300 w-1/3">
                                {groupedData[groupId].otherUsers.map((user) => (
                                <div key={user.u_id}>{user.u_id}</div>
                                ))}
                            </td>
                            </tr>
                        ))}
                </table> 
            </div>       
    </div>
  );
}

export default ViewDets; 