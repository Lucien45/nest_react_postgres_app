import React from 'react';
import { Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/user.css'

const AppLayout: React.FC = () => {
  return (
    <div className='adminPage'>
      <div className='contentPageAdmin'>
        <div className='borderContenuAdmin'>
          <div className='contenuAdmin'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
