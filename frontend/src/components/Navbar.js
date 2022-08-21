import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation,useNavigate } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';
import { GrLogout } from 'react-icons/gr';
import {logout} from '../redux/apiCalls';
import { FcHome } from 'react-icons/fc';
import {MdOutlineAdminPanelSettings} from 'react-icons/md';

import './Navbar.css'
function Navbar({isCurrPath}) {
  const navigate = useNavigate();

  function navigatePage(url){
    navigate(url);
  }
  const currentUser = useSelector((state) => state.user.user.currentUser);

    const location = useLocation();
    const path = location.pathname;
    const dispatch = useDispatch();
    const logoutFunc = function(){
                 logout(dispatch);
            }
  //  console.log(currentUser.user.role);
  return(
    <div className="topnav">
       <nav className="navbar">

       <button onClick={logoutFunc} className="button-35" style={{marginRight:"50px"}}><GrLogout /> Logout</button>
       {/* {!path.includes("/account") && <NavLink to="/account"><CgProfile /> Account</NavLink>}
       {!path.includes("/home") && <NavLink to="/home"><FcHome /> Home</NavLink>} */}
       {!path.includes("/account") && <button className="button-35" onClick={()=>navigatePage("/account")}><CgProfile /> Account</button>}
       {!path.includes("/home") && <button className="button-35" onClick={()=>navigatePage("/home")}><FcHome /> Home</button>}

       {currentUser.user.role==="admin" && <button className="button-35" onClick={()=>navigatePage("/admin")}><MdOutlineAdminPanelSettings /> Dashboard</button> }

       </nav>
  </div>
  )
}

export default Navbar
