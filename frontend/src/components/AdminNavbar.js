
import {motion} from "framer-motion";
import './adminNav.css'
import { BsPencilSquare } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import { FaRegUser} from 'react-icons/fa';
import {VscOutput} from 'react-icons/vsc'
import { AiFillHome } from 'react-icons/ai';
import {FiLogOut} from 'react-icons/fi'
import {logout} from '../redux/apiCalls';
import { useDispatch } from 'react-redux';
import { MdAccountCircle, MdAdminPanelSettings } from "react-icons/md";

function AdminNavbar() {
const dispatch = useDispatch();
 const handleLogout = ()=>{
     logout(dispatch);
 }

 let activeStyle = {
   backgroundColor:"#cfdbff",
   color:"black",
   fontWeight:"600"
};
  return (
    <div className="main-container22" id="adminNavbar">
        <motion.div animate={{x:[-100,100,0]}} transition={{ duration: 0.7 }} className="sidebar-new22">
          <div className="top-section">
          <h4 className="admin-header"><MdAdminPanelSettings /> Admin Dashboard</h4>
          </div>
          <section className="routes">
            
            <NavLink to="/admin"         
             >
              <div className="icon"><BsPencilSquare /></div>
              <div className="title">
              Exam manager
              </div>
              </NavLink>
              <NavLink to="/admin/users"
              style={({ isActive }) =>
              isActive ? activeStyle : undefined
            }
              >
              <div className="icon"><FaRegUser /></div>
              <div className="title">
              User manager
              </div>
              </NavLink>
              <NavLink to="/admin/results"
              style={({ isActive }) =>
              isActive ? activeStyle : undefined
            }
              >
              <div className="icon"><VscOutput /></div>
              <div className="title">
              Result manager
              </div>
              </NavLink>
              <NavLink to="/"
               >
              <div className="icon"><AiFillHome /></div>
              <div className="title">
               Back to Home
              </div>
              </NavLink>
              <NavLink to="/account"
               >
              <div className="icon"><MdAccountCircle /></div>
              <div className="title">
               My Account
              </div>
              </NavLink>
              <button className='admin-btn'
               onClick={handleLogout}
               >Logout <FiLogOut /></button>
          </section>
        </motion.div>
    </div>
  )
}

export default AdminNavbar