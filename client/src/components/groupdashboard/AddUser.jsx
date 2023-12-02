import React, {useState,useEffect} from 'react'

const AddUser = (props) => {
  
  const [initialRender,setInitialRender] = useState(true);
  const group_name = props.group_name
  const [usermsg,setUserMsg] = useState(""); //Message after registering user in group
  const [rolemsg,setRoleMsg] = useState(""); //Message after creating group role 

  //Variables for registering a user in the group
  const [username,setUsername] = useState(""); 
  const [group_role,setGrouproleid] = useState("");
  const [users,setUsers] = useState([]); //Show list of users who are not in group  
  const [options, setOptions] = useState([]); //Show list of group roles
  //Variables for registering group role
  const [group_role_name,setGroupRolename] = useState("");  
  //List of group permissions and check which is checked
  const [groupPermissions,setGroupPermissions] = useState([
    { name: 'Delete group', key: 'delete_group', value: false },
    { name: 'Add user', key: 'add_user', value: false },
    { name: 'Delete group users', key: 'delete_group_users', value: false },
    { name: 'View Group Details', key: 'view_all_dets', value: false },
    { name: 'Create task',key:'create_task', value: false },
  ]);
  //Check if permission is included or not
  const handleCheckboxChange = (key,checked) => {
    setGroupPermissions((prevPermissions) =>
      prevPermissions.map((permission) =>
        permission.key === key ? { ...permission, value: checked  } : permission
      )
    );
  };
  //Get values of permissions given key
  const getValueByKey = (key) => {
    const permission = groupPermissions.find((perm) => perm.key === key);
    return permission ? permission.value : undefined;
  };

  //By default 
  useEffect(() => {
    //retrieve group roles from database and fill inside form
    const fetchGroupRoleData = async () => {
        try{
            const api_call = `http://localhost:8000/api/getgrouproles`;
            const response = await fetch(api_call, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include', //To communicate cookies with server
            });
            console.log(response)
            //Response statuscode - not in range 200-299 : Handle error
            if (!response.ok){
                setUserMsg("Couldnt Retrieve Group role details")
                throw new Error(`HTTP error! Status: ${response.status}`); //Code
            }    
            const resdata = await response.json(); //Response obtained from call
            console.log(resdata)
            
            const mappedOptions = resdata.map((item) => ({
                key: item.gr_id,
                value: item.group_role_name,
              }));
            setOptions(mappedOptions)  
            console.log(`Options: ${options}`)
          }
          catch(error) //Catch the error
          {
            console.error('Error:', error);
          }
      }; 
      //retrieve users from database and fill inside form
      const fetchUsers = async () => {
        try{
            const api_call = `http://localhost:8000/api/getnongroupusers/${group_name}`;
            const response = await fetch(api_call, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include', //To communicate cookies with server
            });
            console.log(response)
            //Response statuscode - not in range 200-299 : Handle error
            if (!response.ok){
                setUserMsg("Couldnt Retrieve User details")
                throw new Error(`HTTP error! Status: ${response.status}`); //Code
            }    
            const resdata = await response.json(); //Response obtained from call
            console.log(resdata)
            
            const mappedOptions = resdata.map((item) => ({
                key: item.username,
              }));
            setUsers(mappedOptions)  
            console.log(`Non Group Users: ${options}`)
          }
          catch(error) //Catch the error
          {
            console.error('Error:', error);
          }
      }; 
      fetchGroupRoleData();
      fetchUsers();
      setInitialRender(false);
    }, [initialRender]);

    //Event handler on submitting add user
    const addUser = async (e) => {
        e.preventDefault();
        //Make API call to backend
        try{
            const api_call = `http://localhost:8000/api/addgroupuser/${group_name}/${username}/${group_role}`;
            const response = await fetch(api_call, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include', //To communicate cookies with server
            });
            console.log(response)
            //Check response status codes
            if(response.status=="400"){ //Bad Request - Password invalid
                setUserMsg("Enter all details!")
                throw new Error(`HTTP error! Status: ${response.status}`); }
            //Response statuscode - not in range 200-299 : Handle error 
            if (!response.ok) {
                setUserMsg("Couldn't add the user, Try after sometime")
                throw new Error(`HTTP error! Status: ${response.status}`); }
            const resdata = await response.json(); //Response obtained from call
            setUserMsg("User has been added to the group Successfully!")
        }
        catch(error) //Catch the error
        {
          console.error('Error:', error);
        }
   }

   //Event handler on adding custom group role
  const addRole = async (e) => {
    e.preventDefault();
    //Make API call to backend
    try{
        console.log(`Permissions: ${groupPermissions}`)
        const delete_group = getValueByKey('delete_group').toString()
        const add_user = getValueByKey('add_user').toString()
        const delete_group_users = getValueByKey('delete_group_users').toString()
        const view_all_dets = getValueByKey('view_all_dets').toString()
        const create_task = getValueByKey('create_task').toString()
        const api_call = `http://localhost:8000/api/addgrouprole/${group_role_name}/${delete_group}/${add_user}/${delete_group_users}/${view_all_dets}/${create_task}`;
        const response = await fetch(api_call, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include', //To communicate cookies with server
        });
        console.log(response)
        //Check response status codes
        if(response.status=="400"){ //Bad Request - Password invalid
            setRoleMsg("Enter all details!")
            throw new Error(`HTTP error! Status: ${response.status}`); }
        //Response statuscode - not in range 200-299 : Handle error 
        if (!response.ok) {
            setRoleMsg("Couldn't add the group role! Try after sometime")
            throw new Error(`HTTP error! Status: ${response.status}`); }
        const resdata = await response.json(); //Response obtained from call
        setRoleMsg("Custom Group Role has been created Successfully!")
    }
    catch(error) //Catch the error
    {
      console.error('Error:', error); 
    }
}

  return (
    <div className='absolute left-[20%] w-[80%] h-[100%] pt-28 px-4 justify-center items-center'>
            <div className='mt-4 flex-col justify-start text-dark-blue'> 
                <h1 className='md:text-5xl sm:text-3xl text-3xl font-bold'>Add User/Role - {props.group_role}</h1> 
            </div> 
            <div className='container mx-auto flex items-center mt-12'>
                <div class="grid grid-cols-2 gap-28">
                    <div className='w-[100%] relative left-[25%] shadow-xl shadow-slate-200 flex flex-col p-4 rounded-lg hover:scale-105 duration-300 bg-white'>
                        <h2 className='text-3xl font-bold text-center py-4'>Add a User to Group</h2>
                        <h2 className='text-m font-bold text-center p-4'>{usermsg}</h2>
                        <div className='flex flex-col justify-center items-center p-4 mt-8 text-center text-black text-bold text-xl max-h-80 overflow-y-auto '>
                            <div className='flex items-start' >
                                <span className='px-6 py-4'> Username </span>
                                <select onChange={e=>setUsername(e.target.value)} className="border-2 text-black px-6 py-2">
                                    <option value="" disabled selected> Select a User </option>
                                    {users && users.map((option) => (
                                        <option value={option.key} className="border-2 text-black px-6 py-2">
                                        {option.key} 
                                        </option>
                                    ))}
                                </select>
                            </div> 
                            <div className='flex items-start' >
                                <span className='px-6 py-4'> Group Role </span>
                                <select onChange={e=>setGrouproleid(e.target.value)} className="border-2 text-black px-6 py-2">
                                    <option value="" disabled selected> Select a Role </option>
                                    {options && options.map((option) => (
                                        <option value={option.key} className="border-2 text-black px-6 py-2">
                                        {option.value} 
                                        </option>
                                    ))}
                                </select>
                            </div> 
                            <submit onClick={addUser} className='bg-gray-light w-[150px] rounded-md text-xl font-mono text-bold m-auto p-1 text-dark-blue border-2 border-blue-500 shadow-m shadow-slate-200 cursor-pointer hover:scale-105 hover:opacity-50'>
                            Add User </submit>
                        </div>          
                    </div>

                    <div className='w-[100%] relative left-[15%] shadow-xl shadow-slate-200 flex flex-col p-4 rounded-lg hover:scale-105 duration-300 bg-white'>
                    <h2 className='text-3xl font-bold text-center py-2'>Create a custom Group Role</h2>
                        <h2 className='text-m font-bold text-center pb-2'>{rolemsg}</h2>
                        <div className='flex flex-col p-2 text-center text-black text-bold text-xl max-h-80 overflow-y-auto '>
                            <div className='flex items-center mb-2'>
                                <span className='px-6 py-1'> Group Role Name </span>
                                <input type="text"  onChange={e=>setGroupRolename(e.target.value)} className="border-2 text-black" />
                            </div> 
                            <span className='px-4 py-1'> Group Permissions </span>
                            <div className='flex items-center flex-col'>
                                {groupPermissions && groupPermissions.map((permission) => (
                                <div className='flex items-center' >
                                    <span className='px-2 py-1'> {permission.name} </span>
                                    <input type="checkbox" onChange={(e) => handleCheckboxChange(permission.key,e.target.checked)} />  
                                </div>
                             ))}
                            </div>
                            <submit onClick={addRole} className='bg-gray-light w-[150px] rounded-md text-xl font-mono text-bold m-auto p-1 text-dark-blue border-2 border-blue-500 shadow-m shadow-slate-200 cursor-pointer hover:scale-105 hover:opacity-50'>
                            Add Role </submit>
                        </div>          
                    </div>
                </div>
            </div>
    </div>
  );
}

export default AddUser; 