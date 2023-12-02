import React, {useState,useEffect} from 'react'

import Navbar from '../components/groupdashboard/Navbar'
import Topbar from '../components/groupdashboard/Topbar'
import Footer from '../components/Footer'
import Body from '../components/groupdashboard/Body'
import AddTask from '../components/groupdashboard/AddTask'
import ViewAllDets from '../components/groupdashboard/ViewAllDets'
import AddUser from '../components/groupdashboard/AddUser'
import DeleteUser from '../components/groupdashboard/DeleteUser'
import CreateTask from '../components/groupdashboard/CreateTask'

import {useLocation } from 'react-router-dom'

const GroupDashboard = () => {
  const { state } = useLocation();
  // Access the data from the state object
  const { group_name, group_admin_id, group_role_name, fullname, username} = state;
  console.log(`State: ${username} ${fullname}`)
  //Set states for variables to determine group role permissions 
  const [delete_group, setDeletegroup] = useState(false);
  const [add_user,setAdduser] = useState(false);
  const [delete_group_users,setDeletegroupusers] = useState(false)
  const [view_all_dets, setViewalldets] = useState(false);
  const [create_task, setCreatetask] = useState(false);
 
  const perms = { delete_group,add_user,delete_group_users,view_all_dets,create_task,}

  //In group dashboard - only main/body content changes as we navigate within the same link : Define to conditionally render that component
  const [activeComponent, setActiveComponent] = useState('maingroupdashboard'); // Default to groupdashboard
  const handleComponentChange = (componentName) => { setActiveComponent(componentName); };
  
  useEffect(() => {
  const fetchData = async () => {
      try{
          const api_call = `http://localhost:8000/api/getgrouprolepermdets/${group_role_name}`;
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
         
          setDeletegroup(resdata.delete_group)
          setAdduser(resdata.add_user)
          setDeletegroupusers(resdata.delete_group_users)
          setViewalldets(resdata.view_all_dets)
          setCreatetask(resdata.create_task)
        }
        catch(error) //Catch the error
        {
          console.error('Error:', error);
        }
    };
  fetchData(); }, []); 
  
  return (
    <div>
      <Navbar perms = {perms} group_name={group_name} fullname={fullname} username={username} setActiveComponent={handleComponentChange}/>
      <Topbar fullname={fullname} username={username} group_name={group_name} setActiveComponent={handleComponentChange}/>
      {activeComponent === 'maingroupdashboard' && <Body group_name={group_name} group_role_name={group_role_name} group_admin_id={group_admin_id} fullname={fullname} username={username}/>} 
      {activeComponent === 'maingroupdashboard' && create_task && <AddTask setActiveComponent={handleComponentChange}/> }
      {activeComponent === 'viewalldets' && <ViewAllDets group_name={group_name} group_role={group_role_name}/>} 
      {activeComponent === 'adduser' && <AddUser group_name={group_name} group_role={group_role_name}/>} 
      {activeComponent === 'delgroupuser' && <DeleteUser group_name={group_name} group_role={group_role_name}/>}  
      {activeComponent === 'createtask' && <CreateTask group_name={group_name} group_role={group_role_name}/>}
      <Footer />
    </div>
  );
}

export default GroupDashboard; 