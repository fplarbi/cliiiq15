'use client'

import { profileSchema, registerSchema, RegisterSchema } from '@/lib/schemas/registerSchema';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { GiPadlock } from 'react-icons/gi';
import { FormProvider, Resolver, useForm } from 'react-hook-form';
import UserDetailsForm from './UserDetailsForm';
import ProfileForm from './ProfileForm';
import { registerUser } from '@/app/actions/authActions';
import { useRouter } from 'next/navigation';
import { handleFormServerErrors } from '@/lib/util';

const stepsSchema = [registerSchema, profileSchema];

export default function RegisterForm() {
    const router = useRouter();
    const [activeStep, setActiveStep] = useState(0);
    const currentValidationSchema = stepsSchema[activeStep];

    const methods = useForm<RegisterSchema>({
        mode: 'onTouched',
        resolver: zodResolver(currentValidationSchema as any) as Resolver<RegisterSchema>,  
    });

    const { handleSubmit, setError, getValues, formState: { errors, isValid, isSubmitting } } = methods;

    const onSubmit = async () => {

        const result = await registerUser(getValues());

        if (result.status === 'success') {
            router.push('/register/success');
        } else {
            handleFormServerErrors(result, setError)
        }
    }

    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return <UserDetailsForm />;
            case 1:
                return <ProfileForm />;
            default:
                return 'unknown step';
        }
    }

    const onBack = () => {
        setActiveStep((prev) => prev - 1);
    }

    const onNext = async () => {
        if (activeStep === stepsSchema.length - 1) {
            await onSubmit();
        } else {
            setActiveStep((prev) => prev + 1);
        }
    }

    return (

        <Card className='w-2/5 mx-auto'>
            <CardHeader className='flex flex-col items-center justify-center'>
                <div className='flex flex-col gap-2 items-center text-secondary'>
                    <div className='flex flex-row items-center gap-3'>
                        <GiPadlock size={30} />
                        <h1 className='text-3xl font-semibold'>Register</h1>
                    </div>
                    <p className='text-sm'>Welcome to CLiiiQ. Please enter your details to create an account.</p>
                </div>
            </CardHeader>
            <CardBody>
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onNext)}>
                        <div className='space-y-4'>
                            {getStepContent(activeStep)}
                            {errors.root?.serverError && (
                                <p className='text-danger text-sm'>{errors.root.serverError.message}</p>
                            )}
                            <div className='flex flex-row items-center gap-6'>
                                {activeStep !== 0 && (
                                    <Button onPress={onBack} fullWidth>
                                        Back
                                    </Button>
                                )}
                                <Button
                                    isLoading={isSubmitting}
                                    isDisabled={!isValid}
                                    fullWidth color='secondary'
                                    type='submit'
                                >
                                    {activeStep === stepsSchema.length - 1 ? 'Submit' : 'Continue'}
                                </Button>
                            </div>

                        </div>
                    </form>
                </FormProvider>
            </CardBody>
        </Card>
    )
}