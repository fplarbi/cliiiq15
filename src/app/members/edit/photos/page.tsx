import { CardHeader, CardBody } from '@heroui/card'
import React from 'react'
import { Image } from '@heroui/image'
import { getAuthUserId } from '@/app/actions/authActions'
import { getMemberByUserId, getMemberPhotosByUserId } from '@/app/actions/memberActions';
import { Divider } from '@heroui/react';
import StarButton from '@/components/StarButton';
import DeleteButton from '@/components/DeleteButton';
import ImageUploadButton from '@/components/imageUploadButton';
import MemberPhotoUpload from './MemberPhotoUpload';
import MemberImage from '@/components/MemberImage';
import MemberPhotos from '@/components/MemberPhotos';

export default async function PhotoPage() {
    const userId = await getAuthUserId();
    const member = await getMemberByUserId(userId);
    const photos = await getMemberPhotosByUserId(userId);

  return (
        <>
      <CardHeader className='flex flex-row justify-between items-center'>
        <div className='text-2xl font-semibold text-secondary'>
          Update Photos
          </div>
        <MemberPhotoUpload />
      </CardHeader>
        <Divider />
        <CardBody>
            
            <MemberPhotos photos={photos} editing={true} mainImageUrl={member?.image} />
        </CardBody>
    </>
  )
}
