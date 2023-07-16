import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers';
import { toast, Toaster } from "react-hot-toast";
import PeerChat from "../artifacts/contracts/PeerChat.sol/PeerChat.json"
import Registration from './Registration';
import { BiLoaderAlt } from "react-icons/bi"
const Home = ({ setverified, setaccount, contract, setaccountDetails, connected, account, setcontract, setprovider, setconnected }) => {
  const [newUser, setnewUser] = useState(false);
  const [name, setname] = useState('');
  const [description, setdescription] = useState('');
  const [number, setnumber] = useState('');
  const [modalOpen, setmodalOpen] = useState(false);
  const [isVerified, setisVerified] = useState(false);
  const [Loading, setLoading] = useState(false);
  const connectFetch = async () => {
    const loadProvider = async (provider) => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });
        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        const { ethereum } = window;
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13881' }],
          });
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            // Do something
            window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x13881',
                chainName: 'Polygon',
                nativeCurrency: {
                  name: 'Mumbai',
                  symbol: 'MATIC',
                  decimals: 18
                },
                rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
                blockExplorerUrls: ['https://mumbai.polygonscan.com']
              }]
            })
              .catch((error) => {
                toast.error("Add Mumbai to MetaMask",
                  {
                    style: {
                      borderRadius: '10px',
                      background: '#333',
                      color: '#fff',
                    },
                  });
              });
          }
        }
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setaccount(address);
        //let contractAddress = "0x7bB64F9E6e948603EB0A4477c3F368080D275605";//ganache address
        let contractAddress = '0x73C41d77240c8b52fa9568c7455c8d070EF65C98';//latest from mumbai
        //let contractAddress = "0x196d4119944CD005AD917466B8e2e2Ec018FA547"; //fantom
        const contractInstance = new ethers.Contract(
          contractAddress,
          PeerChat.abi,
          signer
        );
        setcontract(contractInstance);
        setprovider(provider);
        setconnected(true);
      } else {
        toast.error('Please Install MetaMask',
          {
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          }
        );
        console.error("MetaMask not Installed");
      }
    };
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await loadProvider(provider);
    } catch (error) {
      toast.error("MetaMask not Installed",
        {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
    }
  }
  const getUser = async () => {
    try {
      const result = await contract.getUserDetails(account);
      setaccountDetails(result);
      setverified(true);
    } catch (error) {
      setnewUser(true);
      setmodalOpen(true);
      toast.error("Create An Account",
        {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        })
    }
  };
  const addUser = async () => {
    setLoading(true);
    try {
      const result = await contract.registerUser(name, description, number);
      setmodalOpen(false);
      setnewUser(false);
      toast.success("Account Created !",
        {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      setTimeout(() => { getUser() }, 9000);
    } catch (err) {
      console.log(err);
      toast.error('Error in Creating!',
        {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
    }
    setname(""); setdescription(""); setnumber("");
    setLoading(false);
  }
  useEffect(() => {
    connected && getUser();
  }, [connected, isVerified]);

  return (
    <div >
      <div className="flex flex-col  items-center mt-1  font-serif justify-center ">
        <h1 className=' text-3xl'>PeerChat</h1>
        <div className='ml-96'>
          {connected ? <div className=' py-1 px-4 rounded-xl bg-green-600'>Connected</div> : <button className=' py-1 px-4 rounded-xl bg-blue-500' onClick={connectFetch}>Connect</button>}
        </div>
        <Toaster toastOptions={{ duration: 3000 }} />
      </div>
      {Loading &&
        <div className='flex flex-col items-center relative'>
          <BiLoaderAlt className='mt-64 animate-spin' size={69} />
        </div>
      }
      {!Loading &&
        <div>
          {modalOpen &&
            <div className='flex flex-col items-center relative' >
              {isVerified && <div>
                <div className='flex p-3 items-center justify-around '>
                  <input onChange={(event) => { setname(event.target.value) }} className='m-1 text-black px-1 py-2 rounded-xl' required placeholder=' Name' type='text' />
                  <input className='m-1 text-black px-1 py-2 disabled:bg-slate-300 rounded-xl' required value={number} disabled type='number' />
                </div>
                <input onChange={(event) => { setdescription(event.target.value) }} className='m-3 px-1 py-2 w-[380px] h-[60px]  text-black rounded-xl' placeholder='About' defaultValue="Hey I'm using PeerChat" type='text' />
                <button className='flex items-center py-1 px-4  rounded-xl bg-blue-500' onClick={addUser}>Create Account</button>
              </div>}
              {!isVerified && <Registration setisVerified={setisVerified} setnumber={setnumber} />}
            </div>
          }
        </div>
      }

    </div>
  )
}

export default Home