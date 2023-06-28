import React, { useEffect,useRef,useState } from 'react'
import {IoMdSend} from 'react-icons/io'
import {ImAttachment} from 'react-icons/im'
import {BiLoaderAlt} from 'react-icons/bi'
import { toast, Toaster } from "react-hot-toast";
import ChatText from './ChatText';
import { Web3Storage } from 'web3.storage'
import axios from "axios";
const JWT = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwZTUyNmI4Yy1hNmIzLTQyMGYtOTM5ZC0zZjUzZmRjZjA4ODMiLCJlbWFpbCI6InJvbm5pZXJhanNpbmdoQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI5OTZjNTJkYmFkZjFhZGZmOGU0YSIsInNjb3BlZEtleVNlY3JldCI6ImEyYmFjNjBjNzdlZGQ1ZDdhYTBhYTExNzY5OWZjYWJmMzc0ZmQxNTQzODZhMDQ5NTRmZTMzZTAxNWZlZTg0NzkiLCJpYXQiOjE2ODcyNDUzODJ9.CHifyXne4nGhyQcTSU8kVMFMdNaFktGpK45JdKiHVtI`
const ChatScreen = ({contract , user}) => {
    const [messages, setmessages] = useState(['']);
    const [sendMsg, setsendMsg] = useState('');
    const [file, setfile] = useState(null);
    const [uploading, setuploading] = useState(false);
    const [fileName, setfileName] = useState('');
    const [isImageReq, setisImageReq] = useState(false);
    const [loading, setloading] = useState(false);
    const hiddenFileInput = useRef(null);
    const getMessages=async()=>{
        try {
            const res = await contract.readMessage(user.friendAddress);
            const parse = JSON.parse(JSON.stringify(res));
            setmessages(res);
        } catch (error) {
            toast.error('Error!',
            {
                style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
                },
            }
            );
        }
    }
    const check=()=>{
        if(isImageReq){
            return false;
        }
        if(sendMsg.replace(/\s/g, '').length === 0){
            return true;
        } else{
            return false;
        }
    }
    const uploadImage=async()=>{
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
                const response = await contract.sendImage(user.friendAddress,ImgHash);
                toast.success("Image sent!",
                {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
                });
            } catch (error) {
                console.log(error);
                toast.error("Couldn't Upload",
                {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
                }); 
            }
            setfile(null);
            setfileName('');
            setisImageReq(false);
        } else{
            toast.error("Can't Upload File!",
            {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
            }); 
        }
    }
    const retrieveFile = (e) => {
        const data = e.target.files[0];
        setfile(e.target.files[0]);
        setfileName(e.target.files[0].name);
        setisImageReq(true);
        e.preventDefault();
        //uploadImage();
    };
    const sendImage=()=>{
        hiddenFileInput.current.click();
    }
    const sendMessage=async()=>{
        if(isImageReq){
            uploadImage();
            return;
        }
        try {
            const res = await contract.sendMessage(user.friendAddress,sendMsg);
            toast.success("Message sent!",
            {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
            }); 
        } catch (error) {
            toast.error("Too Many Attempts! Try after some time",
            {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
            }); 
        }
        setsendMsg('');
    }
    useEffect(()=>{
        setTimeout(() => {
            getMessages();
        },500);
    },[messages]);
  return (
    <div>
    <Toaster/>
    <div className=' flex items-end justify-center text-[17px] text-white w-[400px] sm:w-[550px] h-[420px] rounded-b-2xl bg-[#0b2f42]'>
        <div className='overflow-auto mb-1 pt-1  h-[420px] '>
            {messages.length ===0 ? <div className="flex flex-row h-[410px] text-xl items-center justify-center">Say Hi! </div> : 
                <div>
                    {messages.map((msg,i)=>{
                        return(
                            <ChatText setloading={setloading} setsendMsg={setsendMsg} key={i} msg={msg} user={user} />
                        )
                    })}
                </div>
            }
        </div>

    </div>
    <div className='relative flex flex-col w-[400px] sm:w-[550px] mt-1 rounded-2xl '>
    <div>
        {isImageReq ? 
        <div className=" truncate h-[57px] block w-8/12 sm:w-9/12  p-4 pl-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ">{fileName}</div>
        : <div> 
            {
            loading ? <div>
                <div className="items-center justify-center h-[57px] flex w-8/12 sm:w-9/12  p-4 pl-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 " >
                <BiLoaderAlt  className='animate-spin' size={25}/>
                </div>
            </div> :<div>
            <input value={sendMsg} className=" h-[57px] block w-8/12 sm:w-9/12  p-4 pl-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 " placeholder="Enter Message..." onChange={(event)=>{setsendMsg(event.target.value)}} required/>
            </div>
        }
        </div> 
        }
    </div>
    <div className='flex flex-col'>
    <button onClick={sendImage} className=" absolute right-[70px] bottom-2.5 p-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        <ImAttachment size={22}/>
    </button>
    <input
        disabled={uploading}
        type="file"
        name="data"
        accept="image/*"
        ref={hiddenFileInput}
        style={{display:'none'}}
        onChange={retrieveFile}
    />
    <button onClick={sendMessage} disabled={check()} className="text-white absolute right-2.5 bottom-2.5 p-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        <IoMdSend size={22}/>
    </button>
    </div>
    </div>
    </div>
  )
}

export default ChatScreen