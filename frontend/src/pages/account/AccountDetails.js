import React, { useEffect } from 'react'
import {AiOutlineMail,AiOutlinePhone,AiOutlineUserAdd} from 'react-icons/ai'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import {motion} from "framer-motion";



function AccountDetails() {
  const navigate = useNavigate()
  const currentUser = useSelector((state) => state.user.user.currentUser);
  // const onSubmit = data =>{
  //    login(dispatch,data);
  // }
  // const [user,setUser] = useState(null)
  // // let userData = null;
  // const getUserDetails = async function(){
  //   try{
  //     const data = await axios.get("/api/v1/me");
  //     setUser(data.data);
  //     console.log(data.data);
  //  }catch(err){
  //     toast.error(err.message)
  //  }
  // }

  // useEffect(()=>{
  //   getUserDetails()
  // },[])

  
 useEffect(()=>{
  if(!currentUser.user.name){
    navigate("/account/edit");
  }
 },[currentUser,navigate]);


 const userData = currentUser.user;
 const avatar = userData.avatar.url;
//  console.log(user);
//  if(!user){return (<h2>no user!! error</h2>)};
  return (
        <div>
          {/* <header>
          <Navbar />
          </header> */}
         <motion.div className="card2" animate={{ x: [-100, 100, 0] }}
           transition={{ duration: 1 }}>
         <img src={avatar} alt="John" style={{width:"80%",height:"50%",borderRadius:"50%"}} />
         <h1>{userData.name}</h1>
         <p className="title2"><AiOutlineMail /> email: {userData.email}</p>
         <p><AiOutlinePhone /> mobile: {userData.mobile}</p>
         <p> <AiOutlineUserAdd />userId : {userData.userId}</p>
         <p><button className="btn-edit"
          onClick={()=>navigate("/account/edit")}>
            Edit profile
          </button></p>
          <p><button className="btn-edit"
          onClick={()=>navigate("/update")}>
            Update Password
          </button></p>
         </motion.div>
        </div>
        

  )
}

export default AccountDetails