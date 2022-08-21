import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import './Account.css';

function Account() {
  const location = useLocation();
  const isCurrPath = location.pathname==="/account";
  
  return (
    <div>
      <header>
      <Navbar isCurrPath={isCurrPath} />
      </header>
      <h2>My Profile</h2>
      <main>
      <Outlet />
      </main>
    </div>
  )
}

export default Account