'use client';

import CardWrapper from "@/components/CardWrapper";
import { useRouter } from "next/navigation";
import { FaCheck, FaCheckCircle } from "react-icons/fa";

export default function RegisterSuccessPage() {
    const router = useRouter();
  return (
   <CardWrapper
    headerIcon={FaCheckCircle}
    headerText="Registration Successful"
    subtitleText="You have been registered successfully."
    action={() => router.push('/login')}
    actionLabel="Go to Login"
   />
  )
}