import React, { useState } from 'react'
import Upload from '../Components/Upload/Upload'
import { useForm } from "react-hook-form"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addUserImage } from '../services/operations/authApi'



export const MyProfile = () => {
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
      } = useForm()

      const navigate = useNavigate();
      const [loading,setLoading] = useState(false);
      const {token} = useSelector((state)=>state.auth);
      


    const onSubmit = async(data) => {
        const formData = new FormData()

        formData.append("userImage", data.userImage)

        setLoading(true);

        const result = await addUserImage(formData,token)

        if(result){
            navigate("/successfull-upload")
        }


    }

  return (
    <form onSubmit={handleSubmit(onSubmit)}
    className=" min-h-96 my-auto flex justify-between items-center text-3xl text-white flex-col gap-9 ">
        
        <div>
        WELCOME TO BLINKIT_WEB_APPLICATION 

        </div>

        <div className='font-mono'>
            <Upload
                name="userImage"
                label="User Thumbnail"
                register={register}
                setValue={setValue}
                errors={errors}
            />
        </div>
        <button className='border-dotted border-white border-4 px-8 py-3'>
            Submit
        </button>
    </form>
  )
}
