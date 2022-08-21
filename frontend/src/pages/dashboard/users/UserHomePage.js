import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import UserTable from './UserTable';
import {useSelector} from 'react-redux';


function UserHomePage() {
    const [users,setUsers] = useState([]);
    const [count,setCount] = useState(0);
    const [loading,setLoading] = useState(true);
    const username = useSelector((state) =>state.user.user.currentUser.user.userId); 
    

    useEffect(() => {
      fetchUsers()
    },[])
    async function fetchUsers() {
        try{
            let res = await axios.post("/api/v1/users");
            if(res.data.success===true) {
                setCount(res.data.totalUsers);
                const filtered = res.data.users.filter(user=>user.userId!==username);
                setUsers(filtered);
                setLoading(false);
            }
        }catch(e){
            toast.error("failed to fetch data");
            console.log(e.response.data.message);
        }
    }
   if(loading===true) {
    return <div className="lds-hourglass"></div>
   }
  return (
    <div style={{marginBottom:"20px"}}>
        <UserTable users={users} fetchUsers={fetchUsers} count={count} />
    </div>
  )
}

export default UserHomePage