import React, { useState, useEffect } from 'react'
import { FaUserCircle } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";

const ChatCard = ({ contract, address }) => {
    const [user, setuser] = useState('');
    const [fetched, setfetched] = useState(false);
    const [messages, setmessages] = useState('');
    const userDetails = async () => {
        try {
            const res = await contract.getUserDetails(address);
            setuser(res);
            setfetched(true);
        } catch (error) {
            toast.error('Reloading',
                {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });
        }
    }
    const getMessages = async () => {
        try {
            const res = await contract.readMessage(address);
            if (res.length === 0) {
                setmessages("Tap to Chat");
            } else {
                const lastMsg = res[res.length - 1].message;
                if (res[res.length - 1].isText) {
                    setmessages(lastMsg);
                } else {
                    setmessages('-Image-');
                }
            }
        } catch (error) {
            console.log("Error", error);
        }
    }
    useEffect(() => {
        getMessages();
        userDetails();
    }, [user]);
    return (
        <div className=''>
            <Toaster />
            {fetched &&
                <div className='flex flex-col justify-center text-lg text-white w-[360px] sm:w-[450px] h-[100px] p-6 rounded-2xl bg-[#0b2f42]'>
                    <div className='flex flex-row  pb-2'>
                        <div className='mt-2'>
                            {user?.Image === '' && <FaUserCircle className='mr-3' size={50} />}
                            {user?.Image !== '' && <img src={user?.Image} className="mr-3 w-[50px] h-[50px] rounded-full" />}
                        </div>
                        <div className='ml-2 mt-2 '>
                            <div className='truncate font-light text-[22px]'>{user?.Name}</div>
                            <div className='truncate w-[250px] sm:w-[300px] text-[#a5c7d9] pt-[2px]'>{messages}</div>
                        </div>
                    </div>
                    <div className='font-light pt-2 text-[#9dbac9]'>
                    </div>
                </div>
            }
        </div>
    )
}

export default ChatCard