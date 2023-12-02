import React, {useState,useEffect} from 'react'

import Navbar from '../components/groupdashboard/taskdashboard/Navbar'
import Topbar from '../components/groupdashboard/taskdashboard/Topbar'
import Footer from '../components/Footer'
import Body from '../components/groupdashboard/taskdashboard/Body'
import AssignTask from '../components/groupdashboard/taskdashboard/AssignTask'
import DeallocateTask from '../components/groupdashboard/taskdashboard/DeallocateTask'

import {useLocation } from 'react-router-dom'

const TaskDashboard = () => {
  const { state } = useLocation();

  // Access the data from the state object
  const {group_name, task_name, task_lead_id,fullname,username,} = state;

  //In task dashboard - only main/body content changes as we navigate within the same link : Define to conditionally render that component
  const [activeComponent, setActiveComponent] = useState('maintaskdashboard'); // Default to groupdashboard
  const handleComponentChange = (componentName) => { setActiveComponent(componentName); };
  
  return (
    <div>
      <Navbar group_name={group_name} task_name={task_name} task_lead_id={task_lead_id} username={username} fullname={fullname} setActiveComponent={handleComponentChange}/>
      <Topbar fullname={fullname} username={username} group_name={group_name} setActiveComponent={handleComponentChange}/>
      {activeComponent === 'maintaskdashboard' && <Body group_name={group_name} task_name={task_name} task_lead_id={task_lead_id} username={username} />} 
      {activeComponent === 'assigntask' && username==task_lead_id && <AssignTask group_name={group_name} task_name={task_name} />} 
      {activeComponent === 'deallocatetask' && username==task_lead_id && <DeallocateTask group_name={group_name} task_name={task_name} />}  
      <Footer />
    </div>
  );
}

export default TaskDashboard; 