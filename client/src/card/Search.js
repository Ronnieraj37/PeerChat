import React,{useState} from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { toast, Toaster } from "react-hot-toast";
import UserCard from './UserCard';

const Search = ({contract}) => {
    const [num, setnum] = useState('');
    const [address, setaddress] = useState('');
    const [val, setval] = useState(0);
    const [user, setuser] = useState('');
    const [validSearch, setvalidSearch] = useState(false);
    const searchProfile=async()=>{
        if(val === 0){
            const res = await contract.searchUser(num);
            setvalidSearch(true);
            if(res.Address === "0x0000000000000000000000000000000000000000"){
                toast.error('No Account Found!',
                {
                    style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                    },
                }
            );
            } else{
                setuser(res);
            }
        } else{
            try {
                const res = await contract.getUserDetails(address);
                setuser(res);
                setvalidSearch(true);

            } catch (error) {
                toast.error('No Account Found!',
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
    }
    const handleSearchChange=(event)=>{
        setaddress(event.target.value);
    }
    const sendRequest=async()=>{
        try{
            const res = await contract.addFriend(user?.Address);
            toast.success("Request Sent",
                {
                    style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                    },
                }
            );
        } catch(error){
            toast.error("Already Sent or Blocked",
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
  return (
    <div>
    <Toaster />
    <div className='flex flex-col'>
        <div className='flex flex-col items-center justify-center'>
        <div className='text-[#c8d2f7] my-2 text-2xl'>User Search</div>
        <div className='flex flex-row'>
        <button onClick={(event)=>{setval(0)}} className= {`rounded-2xl mx-1 my-3 px-6 py-2 items-center flex ${val===0 ?"bg-[#103CE7]" : "hover:bg-[#0b2f42] " }`}>Number</button>
        <button onClick={(event)=>{setval(1)}}  className= {`rounded-2xl mx-1 my-3 px-6 py-2 items-center flex ${val===1 ?" bg-[#103CE7]" : "hover:bg-[#0b2f42]" }`}>Address</button>
        </div>
        {val===0 && <div className=' w-[280px]'>
        <PhoneInput country={"in"} className="flex ml-1 m-2 text-black text-xl" containerClass='' value={num} onChange={setnum}  />
        </div> }
        {val===1 && <div>
            <header>
            <form>
                <input
                    className='m-1 text-black px-6 w-[280px] py-2 mb-1 rounded-3xl'
                    type="text"
                    placeholder='Enter Address 0x1111...'
                    onChange={handleSearchChange}
                />
            </form>
        </header>
        </div> }
        </div>
        <button onClick={searchProfile} className= " mt-6 mb-3 sticky rounded-2xl mx-1 sm:ml-96 text-xl bg-[#103CE7] px-6 py-1 items-end justify-end ml-60  flex hover:bg-blue-500 ">Search</button>
        { validSearch && <div>
            <UserCard user={user} />
            <div onClick={sendRequest} className='bg-[#076585] hover:bg-[#01445c] flex p-2 items-center rounded-xl mx-24 mt-3 justify-center'>
            <button>Send Request</button>
            </div>
        </div>}
    </div>
    </div>


  )
}

export default Search