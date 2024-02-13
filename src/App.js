import './App.css';
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Home from './Pages/Home';
import Error from './Pages/Error';
import VerifyEmail from './Pages/VerifyEmail';
import { MyProfile } from './Pages/MyProfile';
import { Success } from './Pages/Success';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './services/operations/authApi';



function App() {

  const {token} = useSelector((state)=>state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch()


  

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-slate-900 to-gray-800 flex flex-col font-inter ">

      {
        token && (<button className="mt-6 rounded-[8px] bg-orange-400 py-[8px] px-[12px] text-white font-extrabold w-52" onClick={()=> dispatch(logout(navigate))} >
          Logout
        </button>)
      }
      
      <Routes>
        
        {
          !token &&
        <Route path="/" element={<Signup/>} />
      }

      {
        !token && 
      <Route path="login" element={<Login />} />
      }
   

        <Route path="signup" element={<Signup />} />

        <Route path="*" element={<Error />} />

        <Route path="verify-email" element={<VerifyEmail />} />
      
        <Route path="/dashboard/my-profile" element={<MyProfile/>} />

        <Route path="successfull-upload" element={<Success/>} />


      </Routes>
     

    </div>
  );
}

export default App;
