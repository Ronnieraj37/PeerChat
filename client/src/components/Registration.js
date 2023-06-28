import React, { useState } from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import OTPInput, { ResendOTP } from "otp-input-react"

import {GiRotaryPhone} from 'react-icons/gi'
import {MdVerifiedUser,MdKeyboardBackspace} from 'react-icons/md'
import { toast, Toaster } from "react-hot-toast";
import { RecaptchaVerifier,signInWithPhoneNumber } from "firebase/auth";
import {auth} from "../firebase.config"
const Registration = ({setisVerified , setnumber}) => {
    const [num, setnum] = useState('');
    const [OTP, setOTP] = useState("");
    const [verification, setverification] = useState(false);

    const verifyUser=async ()=>{
        const code = OTP;
        try {
            const response = await window.confirmationResult.confirm(code)
            revertBack();
            toast.success("Phone Verified!",
            {
              style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
              },
            });
            return;
        } catch (error) {
            toast.error("Wrong OTP",
            {
              style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
              },
            });
        }
    }
    const onCaptchaVerify=()=>{
        if(!window.recaptchaVerifier){
            window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
                //onSignUp();
            },
            'expired-callback': () => {
                toast.loading("Expired Session , Retry",
                {
                  style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                  },
                });
            }
            }, auth);
        }
    }
    const onSignUp=()=>{
        if(num === "" || num === undefined){
            toast.error("Number Cannot Be Empty",
            {
              style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
              },
            });
            return;
        }
        onCaptchaVerify();
        const appVerifier = window.recaptchaVerifier;
        const phoneNumber = "+" + num;
        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        toast.success("OTP Sent!",
        {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
        setverification(true);
        return;
        }).catch((error) => {
        toast.error("Too Many Attempts! Try after some time",
        {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }); 
        console.log(error)
        return;
        });
    }
    const goBack=()=>{
        setverification(false);
    }
    const revertBack=()=>{
        setnumber(num);
        setisVerified(true);
    }
  return (
    <div className='flex flex-col items-center'>
        <div id='recaptcha-container'></div>
        <Toaster toastOptions={{ duration: 3000 }} />
        {!verification && <div className='flex flex-col items-center justify-center rounded-xl'>
            <GiRotaryPhone className='mt-16' size={69}/>
            <h2 className='text-2xl mt-2 mb-10'> Phone Verification</h2>
            <PhoneInput country={"in"} className=" m-1 text-black " value={num} onChange={setnum}  />
            <button onClick={onSignUp} className=' mt-4 py-1 px-4  rounded-xl bg-blue-700 hover:bg-blue-500' >Send OTP</button>
        </div>
        }
        { verification && 
            <div className='flex items-center flex-col'>
                <button onClick={goBack}>
                    <MdKeyboardBackspace className='flex items-start mr-80 mt-16' size={30}/>    
                </button>
            <MdVerifiedUser className='mt-8' size={69}/>
            <h2 className='text-2xl mt-2 '> Enter OTP</h2>
            <div className=' font-sans font-light  mt-8'>
            <OTPInput className="text-black text-2xl " value={OTP} onChange={setOTP} autoFocus OTPLength={6} otpType="num" disabled={false}  />
            <ResendOTP className="mt-6 py-1 px-3" onResendClick={()=>{onSignUp() }} />
            </div>
            <div>
            <button className='flex items-center py-1 m-8 px-4  rounded-xl bg-blue-700 hover:bg-blue-500' onClick={verifyUser}>
                <span>Verify</span>
            </button>         
            </div>
            </div>
        }
    </div>
  )
}

export default Registration