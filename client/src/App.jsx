import React from 'react'
import Login from './pages/Login' 
import Dashboard from './pages/Dashboard'
import GroupDashboard from './pages/GroupDashboard'
import TaskDashboard from './pages/TaskDashboard'
import {BrowserRouter,Routes,Route} from 'react-router-dom';

function App() {
  return (
    <> 
      <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/dashboard" element={<Dashboard />} />
            <Route exact path="/groupdashboard" element={<GroupDashboard />} />
            <Route exact path="/taskdashboard" element={<TaskDashboard />} />
          </Routes>
        </BrowserRouter>
    </>
  );
} 
export default App;