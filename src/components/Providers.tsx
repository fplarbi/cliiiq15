'use client';
import { HeroUIProvider } from '@heroui/system'
import React from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
   <HeroUIProvider>
    <ToastContainer position='bottom-right' hideProgressBar className='z-50'/>
        {children}
   </HeroUIProvider>
  )
}
