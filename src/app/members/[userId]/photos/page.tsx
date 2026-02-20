import { getMemberPhotosByUserId } from '@/app/actions/memberActions'
import { CardBody, CardHeader } from '@heroui/card'
import { Divider } from '@heroui/react'
import { Image }from '@heroui/image'
import React from 'react'

export default async function PhotosPage({ params }: { params: {userId: string} }) {
    const photos = await getMemberPhotosByUserId(params.userId);
  return (
   <>
      <CardHeader className='text-2xl font-semibold text-secondary'>
        Photos
      </CardHeader>
      <Divider />
      <CardBody>
        <div className='grid grid-cols-3'>
            {photos && photos.map(photo => (
                <div key={photo.id}>
                    <Image 
                        width={200}
                        src={photo.url}
                        alt='image of member'
                        className='object-cover aspect-square'
                    />

                </div>
            ))}
        </div>
      </CardBody>
      
    </>
  )
}
