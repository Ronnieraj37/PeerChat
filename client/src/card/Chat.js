import React,{useEffect, useState} from 'react'
import { toast, Toaster } from "react-hot-toast";
import {BiLoaderAlt} from "react-icons/bi"
import {DiProlog} from "react-icons/di"
import ChatCard from './ChatCard';
import ChatScreen from './ChatScreen';
import {MdOutlineKeyboardBackspace} from 'react-icons/md'
const Chat = ({contract}) => {
    const [noFriends, setnoFriends] = useState(false);
    const [friends, setfriends] = useState([]);
    const [chatOpen, setchatOpen] = useState(false);
    const [userNo, setuserNo] = useState(null);
    const [loading, setloading] = useState(true);
    const getFriends=async()=>{
        try {
            const response = await contract.getFriendList();
            setfriends(response);
            if(response.length === 0){
            setnoFriends(true);
            }
        } catch (error) {
            toast.error('Refresh the page',
            {
                style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
                },
            }
            );
        }
        setloading(false);
    }
    const closeChat=()=>{
        setchatOpen(false);
        setloading(true);
        setuserNo(null);
    }
    const openChat=(i)=>{
        setuserNo(i);
        setchatOpen(true);
    }
    useEffect(()=>{
        setTimeout(() => {
            getFriends();
        },200);
    },[friends]);
  return (
    <div>
        <Toaster/>
        {loading && <div className='flex flex-col items-center relative'>
            <BiLoaderAlt  className='mt-64 animate-spin' size={45}/>
        </div> }
        {!loading && <div>

        {!chatOpen && <div className='p-2 flex justify-center items-center text-[#c8d2f7] my-2 text-2xl'>Chat</div>
        }
        {noFriends &&
        <div className="flex flex-col items-center">
            <div className="mt-36 mb-4 text-xl">Add Friends to Chat</div>
            <DiProlog size={145} />
        </div>
         }
        {chatOpen && <div  className=' mt-3 max-h-[480px] w-[400px] sm:w-[550px]'>
            <div className=' relative flex py-3 flex-row h-[48px] justify-center rounded-t-2xl bg-[#0b2f42]'>
            <MdOutlineKeyboardBackspace onClick={closeChat} className='absolute left-3.5 top-2 rounded-xl hover:bg-[#0b2f42] ' size={32}/>
            <div className='flex items-center font-sans font-light text-[24px] justify-center'>
                {friends[userNo].name}
            </div>
            </div>
            <hr className="h-[2px] bg-gray-200 border-0 dark:bg-gray-700"/>
            <ChatScreen contract={contract} user={friends[userNo]} />    
        </div>}
        {!chatOpen && <div>    
        {!noFriends && <div>
            {friends.map((friend,i)=>{
                return (
                    <div onClick={()=>{openChat(i)}} key={i} className='py-2'>
                        <ChatCard contract={contract} address={friend[1]}/>
                    </div>
                )
            })}
        </div>
        }
        </div>}

        </div>}
        
    </div>
  )
}

export default Chat