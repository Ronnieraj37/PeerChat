import React, { useState, useEffect } from 'react'
import UserCard from './UserCard';
import { toast, Toaster } from "react-hot-toast";
import { SiApacheopenoffice } from 'react-icons/si';
const FriendList = ({ contract }) => {
    const [friendReq, setfriendReq] = useState([]);
    const [noReq, setnoReq] = useState(false);
    const getFriendReq = async () => {
        const res = await contract.friendRequestList();
        setfriendReq(res);
        if (res.length == 0) {
            setnoReq(true);
        }
    }
    useEffect(() => {

        getFriendReq();

    }, [friendReq])
    const acceptRequest = async (i) => {
        try {
            const res = await contract.acceptRequest(friendReq[i].Address);
            toast.success("Friend Added",
                {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
        } catch (error) {
            toast.error("Cannot Accept Now",
                {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
        }
        getFriendReq();
    }
    const rejectRequest = async (i) => {
        try {
            const res = await contract.rejectFriendRequest(friendReq[i].Address);
            toast.success("Request Rejected",
                {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
        } catch (error) {
            toast.error("Cannot Accept Now",
                {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
        }
        getFriendReq();
    }
    const blockRequest = async (i) => {
        try {
            const res = await contract.blockUser(friendReq[i].Address);
            toast.success("User Blocked",
                {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
        } catch (error) {
            toast.error("Cannot Block Now",
                {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
        }
        getFriendReq();
    }
    return (
        <div>
            <Toaster />
            <div className='p-2 flex justify-center items-center text-[#c8d2f7] my-2 text-2xl'>Friend Requests</div>
            {noReq && <div className=' m-7 mt-32'>
                <h2 className='flex flex-row font-serif text-2xl'>No Requests</h2>
                <SiApacheopenoffice className=' ml-6 mt-5' size={79} />
            </div>}
            {!noReq && <div className='overflow-auto h-[480px]'>
                {friendReq.map((friend, i) => {
                    return (
                        <div key={i} className='scale-[86%] flex flex-col bg-[#0b2f42] rounded-xl '>
                            <UserCard user={friend} />
                            <div className=' mb-2 px-4 items-center justify-around flex flex-row'>
                                <button className='bg-[#1b1b26] px-4 py-1 text-lg rounded-2xl text-green-500' onClick={() => { acceptRequest(i) }}>Accept</button>
                                <button className='bg-[#1b1b26] px-4 py-1 text-lg rounded-2xl text-yellow-200' onClick={() => { rejectRequest(i) }}>Reject</button>
                                <button className='bg-[#1b1b26] px-4 py-1 text-lg rounded-2xl text-red-500' onClick={() => { blockRequest(i) }}>Block</button>
                            </div>
                        </div>
                    )
                })
                }
            </div>}
        </div>
    )
}

export default FriendList