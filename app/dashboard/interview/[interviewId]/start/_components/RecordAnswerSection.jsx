import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'
import Webcam from 'react-webcam'

function RecordAnswerSection() {
  return (
    <div className='flex items-center justify-center'>
        <div className='flex flex-colsjustify-center mt-20 items-center bg-secondary rounded-lg p-5 bg-black'>
            <Image src={'/webcam.jpg'} width={200} height={200} className='absolute'/>
            <Webcam
            mirrored={true}
            style={{
                height:300,
                width:'100%',
                zIndex:10,
            }}
            />
        </div>

        <Button variant="outline" className='my-10'>Record Answer</Button>
    </div>
  )
}

export default RecordAnswerSection