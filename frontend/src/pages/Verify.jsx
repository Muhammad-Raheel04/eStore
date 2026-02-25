import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Verify = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        toast.warning("Login will only work if your email has been verified.");

        setTimeout(() => {
            navigate('/login');
        }, 1500);
    };

    return (
        <div className='relative w-full h-[760px] overflow-hidden'>
            <div className='min-h-screen flex items-center justify-center bg-pink-100 px-4'>
                <div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center'>

                    <h2 className='text-2xl font-semibold text-green-500 mb-4'>
                        ✅ Check Your Email
                    </h2>

                    <p className='text-gray-400 text-sm mb-6'>
                        We've sent you an email to verify your account.
                        Please check your inbox and click the verification link.
                    </p>

                    <button
                        onClick={handleLoginClick}
                        className='w-full bg-black text-white py-2 rounded-lg hover:opacity-90 transition'
                    >
                        I have verified my email → Login
                    </button>

                </div>
            </div>
        </div>
    )
}

export default Verify