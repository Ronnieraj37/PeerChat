import React,{useEffect, useRef,useState} from 'react'
import {FaUserCircle,FaAngleUp} from "react-icons/fa";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
const Profile = ({contract ,accountDetails,account}) => {
  const [accountInfo, setaccountInfo] = useState(accountDetails);
  const [modal, setmodal] = useState(false);
  const hiddenFileInput = useRef(null);
  const [file, setfile] = useState(null);
  const JWT = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwZTUyNmI4Yy1hNmIzLTQyMGYtOTM5ZC0zZjUzZmRjZjA4ODMiLCJlbWFpbCI6InJvbm5pZXJhanNpbmdoQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI5OTZjNTJkYmFkZjFhZGZmOGU0YSIsInNjb3BlZEtleVNlY3JldCI6ImEyYmFjNjBjNzdlZGQ1ZDdhYTBhYTExNzY5OWZjYWJmMzc0ZmQxNTQzODZhMDQ5NTRmZTMzZTAxNWZlZTg0NzkiLCJpYXQiOjE2ODcyNDUzODJ9.CHifyXne4nGhyQcTSU8kVMFMdNaFktGpK45JdKiHVtI`
  const retrieveFile = (e) => {
    const data = e.target.files[0];
    setfile(e.target.files[0]);
    e.preventDefault();
  };
  const uploadImage=()=>{
    hiddenFileInput.current.click();
  }
  const uploadPhoto =async()=>{
    if(file){
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                maxBodyLength: "Infinity",
                headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                Authorization: JWT,
                }
            });
            const ImgHash = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
            const response = await contract.addPhoto(ImgHash);
            toast.success("Image Uploaded!",
            {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
            });
        } catch (error) {
            console.log(error);
            toast.error("Couldn't Upload to IPFS",
            {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
            }); 
        }
        setfile(null);
    } else{
        toast.error("Couln't Update",
        {
        style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
        },
        }); 
    }
  }
  const getUser=async()=>{
    try {
      const result = await contract.getUserDetails(account);
      setaccountInfo(result);
    } catch (error) {
      toast.error("Error in getting",
        {
        style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
        },
        });
    }
  }
  useEffect(()=>{
    setTimeout(()=>{
      getUser();
    },300)
    if(file !== null){
      uploadPhoto();
    }
  },[file,accountInfo]);
  return (
    <div className= 'flex flex-col items-start justify-start -mt-8 text-white'>
      <Toaster/>
      <div className='flex flex-row'>
      <button onClick={()=>{setmodal(!modal)}} className= 'flex flex-row'>
      {accountInfo?.Image == '' && <FaUserCircle className='mr-2' size={33} />}
      {accountInfo?.Image != '' && <img src={accountInfo?.Image} className="mr-2 w-[33px] h-[33px] rounded-full" />}
      <div className='text-xl font-light'>{accountInfo?.Name}</div>
      </button>
      {modal && <FaAngleUp onClick={()=>{setmodal(!modal)}} className=' ml-1 mt-1' size={20} /> } 
      </div>
      {modal && <div className=" px-4 py-1 mt-2 rounded-2xl bg-[#13131a]">
        <button onClick={uploadImage} >Upload Image</button>
      </div>}
      <input
        type="file"
        name="data"
        accept="image/*"
        ref={hiddenFileInput}
        style={{display:'none'}}
        onChange={retrieveFile}
      />
    </div>
  )
}

export default Profile