import { Card, CardBody, CardHeader } from '@heroui/card'
import React from 'react'

export default function EmptyState() {
  return (
    <div className='flex justify-center items-center mt-20'>
        <Card className='p-5'>
            <CardHeader className='text-3xl text-secondary'>
                No results found for this filter
            </CardHeader>
            <CardBody className='text-center'>
                Please try adjusting your filters.
            </CardBody>
        </Card>
        
    </div>
  )
}
