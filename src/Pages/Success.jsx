import React from 'react'
import { useNavigate } from 'react-router-dom'

export const Success = () => {

    const navigate = useNavigate();
  return (
    <div className='flex flex-col text-3xl font-bold min-w-screen gap-32 text-white items-center justify-center'>
        <div>
            SUCCESSFULLY UPLOADED!!!
        </div>
        <button className="p-4 border-white border-dotted border-2 shadow-md shadow-white " onClick={()=>{navigate("/dashboard/my-profile")}}>
            Upload More
        </button>
    </div>
  )
}
