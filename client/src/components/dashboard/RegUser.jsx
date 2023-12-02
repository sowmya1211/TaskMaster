import React, {useState,useEffect} from 'react'

const RegUser = (props) => {
  
  const [usermsg,setUserMsg] = useState(""); //Message after registering user
  const [rolemsg,setRoleMsg] = useState(""); //Message after creating user role 

  //Variables for registering user
  const [username,setUsername] = useState(""); 
  const [password,setPassword] = useState(""); 
  const [fullname,setFullname] = useState(""); 
  const [email_id,setEmailid] = useState("");
  const [user_role,setUserroleid] = useState("");  
  const [options, setOptions] = useState([]); //Show list of user roles
  //Variables for registering user role
  const [user_role_name,setUserRolename] = useState(""); 
  //List of user permissions and check which is checked
  const [userPermissions,setUserPermissions] = useState([
    { name: 'Register users', key: 'reg_user', value: false },
    { name: 'View Details', key: 'view_dets', value: false },
    { name: 'Delete users',key:'delete_users', value: false },
    { name: 'Create group',key:'create_group', value: false },
    { name: 'Delete groups',key:'delete_groups', value: false },
  ]);
  //Check if permission is included or not
  const handleCheckboxChange = (key,checked) => {
    setUserPermissions((prevPermissions) =>
      prevPermissions.map((permission) =>
        permission.key === key ? { ...permission, value: checked  } : permission
      )
    );
  };
  //Get values of permissions given key
  const getValueByKey = (key) => {
    const permission = userPermissions.find((perm) => perm.key === key);
    return permission ? permission.value : undefined;
  };

  //On default - retrieve user roles from database and fill inside form
  useEffect(() => {
    const fetchData = async () => {
        try{
            const api_call = `http://localhost:8000/api/getuserroles`;
            const response = await fetch(api_call, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include', //To communicate cookies with server
            });
            console.log(response)
            //Response statuscode - not in range 200-299 : Handle error
            if (!response.ok){
                setUserMsg("Couldnt Retrieve User role details")
                throw new Error(`HTTP error! Status: ${response.status}`); //Code
            }    
            const resdata = await response.json(); //Response obtained from call
            console.log(resdata)
            
            const mappedOptions = resdata.map((item) => ({
                key: item.ur_id,
                value: item.user_role_name,
              }));
            setOptions(mappedOptions)  
            console.log(`Options: ${options}`)
          }
          catch(error) //Catch the error
          {
            console.error('Error:', error);
          }
      }; 
      fetchData(); }, []);

    //Event handler on submitting add user
    const addUser = async (e) => {
        e.preventDefault();
        //Make API call to backend
        try{
            const api_call = `http://localhost:8000/api/reguser/${username}/${password}/${fullname}/${email_id}/${user_role}`;
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
            setUserMsg("User details have been added Successfully!")
        }
        catch(error) //Catch the error
        {
          console.error('Error:', error);
        }
   }

   //Event handler on adding custom user role
  const addRole = async (e) => {
    e.preventDefault();
    //Make API call to backend
    try{
        console.log(`Permissions: ${userPermissions}`)
        const reg_user = getValueByKey('reg_user').toString()
        const view_dets = getValueByKey('view_dets').toString()
        const delete_users = getValueByKey('delete_users').toString()
        const create_group = getValueByKey('create_group').toString()
        const delete_groups = getValueByKey('delete_groups').toString()
        const api_call = `http://localhost:8000/api/adduserrole/${user_role_name}/${reg_user}/${view_dets}/${delete_users}/${create_group}/${delete_groups}`;
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
            setRoleMsg("Couldn't add the user role! Try after sometime")
            throw new Error(`HTTP error! Status: ${response.status}`); }
        const resdata = await response.json(); //Response obtained from call
        setRoleMsg("Custom User Role has been created Successfully!")
    }
    catch(error) //Catch the error
    {
      console.error('Error:', error);
    }
}

  return (
    <div className='absolute left-[20%] w-[80%] h-[100%] pt-28 px-4 justify-center items-center'>
            <div className='mt-4 flex-col justify-start text-dark-blue'> 
                <h1 className='md:text-5xl sm:text-3xl text-3xl font-bold'>Create User/Role - {props.role}</h1> 
            </div> 
            <div className='container mx-auto flex items-center mt-12'>
                <div class="grid grid-cols-2 gap-28">
                    <div className='w-[100%] relative left-[25%] shadow-xl shadow-slate-200 flex flex-col p-4 rounded-lg hover:scale-105 duration-300 bg-white'>
                        <h2 className='text-3xl font-bold text-center py-4'>Register a User</h2>
                        <h2 className='text-m font-bold text-center pb-4'>{usermsg}</h2>
                        <div className='flex flex-col justify-center items-center p-4 text-center text-black text-bold text-xl max-h-80 overflow-y-auto '>
                            <div className='flex items-center'>
                                <span className='px-6 py-2'> Username </span>
                                <input type="text"  onChange={e=>setUsername(e.target.value)} className="border-2 text-black" />
                            </div> 
                            <div className='flex items-center'>
                                <span className='px-7 py-2'> Password </span>
                                <input type="password"  onChange={e=>setPassword(e.target.value)} className="border-2 text-black" />
                            </div> 
                            <div className='flex items-center'>
                                <span className='px-6 py-2'> Full Name </span>
                                <input type="text"  onChange={e=>setFullname(e.target.value)} className="border-2 text-black" />
                            </div> 
                            <div className='flex items-center'>
                                <span className='px-8 py-2'> Email ID </span>
                                <input type="text"  onChange={e=>setEmailid(e.target.value)} className="border-2 text-black"  />
                            </div> 
                            <div className='flex items-start' >
                                <span className='px-6 py-4'> User Role </span>
                                <select onChange={e=>setUserroleid(e.target.value)} className="border-2 text-black px-6 py-2">
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
                    <h2 className='text-3xl font-bold text-center py-2'>Create a custom User Role</h2>
                        <h2 className='text-m font-bold text-center pb-2'>{rolemsg}</h2>
                        <div className='flex flex-col p-2 text-center text-black text-bold text-xl max-h-80 overflow-y-auto '>
                            <div className='flex items-center mb-2'>
                                <span className='px-6 py-1'> User Role Name </span>
                                <input type="text"  onChange={e=>setUserRolename(e.target.value)} className="border-2 text-black" />
                            </div> 
                            <span className='px-4 py-1'> User Permissions </span>
                            <div className='flex items-center flex-col'>
                                {userPermissions && userPermissions.map((permission) => (
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

export default RegUser; 