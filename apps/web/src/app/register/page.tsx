import { RegisterForm } from '@/components/register-form'
import { AuthPage } from './../../components/auth-page'
import { HeaderOnlyLogo } from './../../components/HeaderOnlyLogo'

export default function RegisterPage() {
  return (<><HeaderOnlyLogo />
  <div className='max-sm:hidden'><AuthPage initialView="register" /></div>
  <div className='flex items-center justify-center min-h-screen bg-[#f6f5f7] font-sans'>
  <div className='md:hidden relative overflow-hidden w-[768px] max-w-full min-h-[500px] bg-white rounded-[25px] shadow-[0_14px_28px_rgba(0,0,0,0.25),0_10px_10px_rgba(0,0,0,0.22)]'>
  <div className='flex flex-col items-center justify-center h-full px-4 sm:px-12 bg-white w-full max-w-md mx-auto'>
    <RegisterForm />
    </div>
    </div>
    </div>
  </>)
}

