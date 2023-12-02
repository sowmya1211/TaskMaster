import React, {useState,useEffect} from 'react'

const Profile = ({username,setFullname,fullname,role}) => {
  
  //Set states for profile details
  const [password, setPassword] = useState("");
  const [email_id, setEmailid] = useState("");
  //Message to be displayed after editing
  const [msg,setMsg] = useState("");
  const [initialRender, setInitialRender] = useState(true);
  //On default - retrieve values from database and fill form
  useEffect(() => {
  const fetchData = async () => {
      try{
          const api_call = `http://localhost:8000/api/getprofile`;
          const response = await fetch(api_call, {
              method: 'GET',  
              headers: {'Content-Type': 'application/json'},
              credentials: 'include', //To communicate cookies with server
          });
          console.log(response)
          //Response statuscode - not in range 200-299 : Handle error
          if (!response.ok){
              setMsg("Couldnt Retrieve Profile Details")
              throw new Error(`HTTP error! Status: ${response.status}`); //Code
          }    
          const resdata = await response.json(); //Response obtained from call
          console.log(resdata)
         
          setFullname(resdata.fullname)
          setEmailid(resdata.email_id)
        }
        catch(error) //Catch the error
        {
          console.error('Error:', error);
        }
    };
  fetchData(); }, [initialRender]);

  //Event handler on submit
  const submit = async (e) => {
    e.preventDefault();
    //Make API call to backend
    try{
        const api_call = `http://localhost:8000/api/editprofile`
        const dataToUpdate = {
            fullname: `${fullname}`,
            email_id: `${email_id}`,
            password: `${password}`,
          };
        const response = await fetch(api_call, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include', //To communicate cookies with server
            body: JSON.stringify(dataToUpdate)
        });
        console.log(response)
        //Response statuscode - not in range 200-299 : Handle error
        if (!response.ok){
            setMsg("Couldnt Update Profile Details")
            throw new Error(`HTTP error! Status: ${response.status}`); //Code
        }  
        const resdata = await response.json(); //Response obtained from call
        console.log(resdata)
        setFullname(resdata.fullname)
        setEmailid(resdata.email_id)
        setMsg("Profile Details have been updated Successfully!")
        setInitialRender(false)
    }
    catch(error) //Catch the error
    { 
      console.error('Error:', error);
    }
}

  return (
    <div className='absolute left-[20%] w-[80%] h-[90%] pt-20 px-4 justify-center items-center'>
            <h3 className='text-2xl font-serif font-bold text-center pb-1 text-dark-blue '>{msg}</h3> 
            <h3 className='text-xl font-bold text-center pb-2 text-dark-blue'>NOTE: Password is hashed. Cannot view, but you can edit</h3> 
            <div className='w-[60%] h-[80%] absolute left-[18%] flex flex-col m-5 mb-15 shadow-xl shadow-slate-200 p-4 rounded-lg bg-logo-blue'>
                <h3 className='text-3xl font-serif font-bold text-center pt-6 text-white'>PROFILE</h3> 
                <form className='flex flex-col justify-center items-center p-4 text-center text-black text-bold text-xl'>
                    <div className='flex items-center'>
                        <span className='px-10 py-5 text-2xl text-white'> Username </span>
                        <input type="text" value={username} disabled/>
                    </div> 
                    <div className='flex items-center'>
                        <span className='px-10 py-5 text-2xl text-white'> Password </span>
                        <input type="password" placeholder="Secured" className='ml-2' onChange={e => setPassword(e.target.value)}/>
                    </div>   
                    <div className='flex items-center'>
                        <span className='px-10 py-5 text-2xl text-white'> Full Name </span>
                        <input type="text" placeholder={fullname} onChange={e => setFullname(e.target.value)}/>
                    </div>   
                    <div className='flex items-center'>
                        <span className='px-10 py-5 text-2xl text-white'> Email ID </span>
                        <input type="text" placeholder={email_id} onChange={e => setEmailid(e.target.value)} className='ml-2'/>
                    </div>  
                    <div className='flex items-center'>
                        <span className='px-10 py-5 text-2xl text-white'> User Role </span>
                        <input type="text" value={role} disabled/>
                    </div>    
                    <submit onClick={submit} className='bg-gray-light w-[150px] h-[50px] rounded-md text-2xl font-mono text-bold m-auto p-2 text-dark-blue border-2 border-blue-500 shadow-m shadow-slate-200 cursor-pointer hover:scale-105 hover:opacity-50'>
                        Edit
                    </submit>
                </form> 
            </div>       
    </div>
  );
}

export default Profile; 