import React, { useEffect, useState } from 'react'
import {FaUserCircle} from "react-icons/fa";
import copy from "copy-to-clipboard";
const UserCard = ({user}) => {
  const [num, setnum] = useState('');
  const copyAddress=()=>{
    copy(user?.Address);
  }
  useEffect(()=>{
    const res = user?.uniqueId.slice(2);
    setnum(res);
  },[])
  return (
    <div className='flex flex-col text-lg text-white w-[350px] sm:w-[500px] h-[240px] p-6 rounded-2xl bg-[#0b2f42]'>
      <div className='flex flex-row  pb-2'>
      <div>
        {user?.Image ==='' && <FaUserCircle className='mr-3' size={100}/>}
        {user?.Image !=='' && <img src={user?.Image} className="mr-2 w-[100px] h-[100px] rounded-full" />}
        </div>
      <div className='ml-2 mt-5'>
      <div className='truncate font-light text-[24px]'>{user?.Name}</div>
      <div className='text-[#a5c7d9] pt-1'>{num}</div>
      </div>
      </div>
      <div className='font-light pt-2 text-[#9dbac9]'>
      <div className='truncate'>{user?.About}</div>
      <div className='truncate pt-2' onClick={copyAddress}>{user?.Address}</div>
      </div>
    </div>
  )
}

export default UserCard