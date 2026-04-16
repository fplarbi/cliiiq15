'use client'

import { deleteImage, setMainImage } from '@/app/actions/userActions';
import { Photo } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { fa } from 'zod/locales';
import DeleteButton from './DeleteButton';
import MemberImage from './MemberImage';
import StarButton from './StarButton';
import { toast } from 'react-toastify';

type Props = {
    photos: Photo[] | null;
    editing?: boolean;
    mainImageUrl?: string | null;
}

export default function MemberPhotos({ photos, editing, mainImageUrl }: Props) {
    const router = useRouter();
    const [loading, setLooading] = useState({
        type: '',
        isLoading: false,
        id: ''
    })

    const onSetMain = async (photo: Photo) => {
        if (photo.url === mainImageUrl) return null;
        setLooading({ isLoading: true, id: photo.id, type: 'main' });
        try {
            await setMainImage(photo);
            router.refresh();
        } catch (error: unknown) {
            if (error instanceof Error) toast.error(error.message);
            else toast.error("An error occurred while setting main image.");
            setLooading({ isLoading: false, id: '', type: '' })
        }

    }

    const onDelete = async (photo: Photo) => {
        if (photo.url === mainImageUrl) return null;
        setLooading({ isLoading: true, id: photo.id, type: 'main' });
        await deleteImage(photo);
        router.refresh();
        setLooading({ isLoading: false, id: '', type: '' })
    }

    return (
        <div className='grid grid-cols-5 gap-5 p-5'>
            {photos && photos.map(photo => (
                <div key={photo.id} className='relative'>
                    <MemberImage photo={photo} />
                    {editing && (
                        <>
                            <div onClick={() => onSetMain(photo)} className='absolute top-3 left-3  z-50'>
                                <StarButton
                                    selected={photo.url === mainImageUrl}
                                    loading={
                                        loading.isLoading
                                        && loading.type === 'main'
                                        && loading.id === photo.id
                                    }
                                />
                            </div>
                            <div onClick={() => onDelete(photo)} className='absolute top-3 right-3  z-50'>
                                <DeleteButton
                                    loading={
                                        loading.isLoading
                                        && loading.type === 'delete'
                                        && loading.id === photo.id
                                    }
                                />
                            </div>
                        </>
                    )}

                </div>
            ))}
        </div>
    )
}
