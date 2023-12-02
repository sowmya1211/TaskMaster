import React, {useState,useEffect} from 'react'

import Navbar from '../components/dashboard/Navbar'
import Topbar from '../components/dashboard/Topbar'
import Footer from '../components/Footer'
import Body from '../components/dashboard/Body'
import AddGrp from '../components/dashboard/AddGrp'
import Profile from '../components/dashboard/Profile'
import RegUser from '../components/dashboard/RegUser'
import ViewDets from '../components/dashboard/ViewDets'
import DeleteUser from '../components/dashboard/DeleteUser'
import DeleteGroup from '../components/dashboard/DeleteGroup'
import CreateGroup from '../components/dashboard/CreateGroup'

import {useLocation } from 'react-router-dom'

const Dashboard = () => {
  const { state } = useLocation();

  // Access the data from the state object
  const { username, name } = state;
  console.log(`Name: ${name}`)

  //Set states for variables to determine user role permissions
  const [user_role_name,setUserrole] = useState("");
  const [reg_user, setReguser] = useState(false);
  const [view_dets, setViewdets] = useState(false);
  const [delete_users, setDeleteusers] = useState(false);
  const [create_group, setCreategroup] = useState(false);
  const [delete_groups, setDeletegroups] = useState(false);
 
  const perms = { reg_user,view_dets,delete_users,create_group,delete_groups,};

  //In dashboard - only main/body content changes as we navigate within the same link : Define to conditionally render that component
  const [activeComponent, setActiveComponent] = useState('maindashboard'); // Default to maindashboard
  const handleComponentChange = (componentName) => { setActiveComponent(componentName); };
  //Similary have certain common vars
  const [fullname, setFullname] = useState(name); // Default to  one passed
  const handleNameChange = (name) => { setFullname(name); };
  
  useEffect(() => {
  const fetchData = async () => {
      try{
          const api_call = `http://localhost:8000/api/getuserrolepermdets`;
          const response = await fetch(api_call, {
              method: 'GET',
              headers: {'Content-Type': 'application/json'},
              credentials: 'include', //To communicate cookies with server
          });
          console.log(response)
          //Response statuscode - not in range 200-299 : Handle error
          if (!response.ok) 
              throw new Error(`HTTP error! Status: ${response.status}`); //Code
          const resdata = await response.json(); //Response obtained from call
          console.log(resdata)
         
          setUserrole(resdata.user_role_name) 
          setReguser(resdata.reg_user)
          setViewdets(resdata.view_dets)
          setDeleteusers(resdata.delete_users)
          setCreategroup(resdata.create_group)
          setDeletegroups(resdata.delete_groups) 
        }
        catch(error) //Catch the error
        {
          console.error('Error:', error);
        }
    };
  fetchData(); }, []);
   
  return (
    <div>
      <Navbar perms = {perms} username={username} setActiveComponent={handleComponentChange}/>
      <Topbar fullname={fullname} setActiveComponent={handleComponentChange}/>
      {activeComponent === 'maindashboard' && <Body role={user_role_name} fullname={fullname} username={username} />} 
      {activeComponent === 'maindashboard' && create_group && <AddGrp setActiveComponent={handleComponentChange}/> }
      {activeComponent === 'userprofile' && <Profile username={username} fullname={fullname} setFullname={handleNameChange} role={user_role_name} />} 
      {activeComponent === 'reguser' && <RegUser role={user_role_name} />} 
      {activeComponent === 'viewdets' && <ViewDets role={user_role_name}/>} 
      {activeComponent === 'deluser' && <DeleteUser role={user_role_name}/>} 
      {activeComponent === 'delgroup' && <DeleteGroup role={user_role_name}/>}  
      {activeComponent === 'creategroup' && <CreateGroup role={user_role_name}/>}
      <Footer /> 
    </div>
  );
}
 
export default Dashboard;  