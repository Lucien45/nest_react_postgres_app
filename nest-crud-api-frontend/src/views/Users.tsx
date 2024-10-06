import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Users: React.FC = () => {
  return (
    <div className='clubs-container'>
        <div className="navbarPage">
          <div className='titre-page'>
            <Link to='/manage'>Users</Link>
          </div>
          <button className='apply-button' id='btnAdd'><Link to='/add'>Ajouter</Link></button>
        </div>
        <div className='outlet-page'>
            <Outlet />
        </div>
    </div>
  );
}

export default Users;
