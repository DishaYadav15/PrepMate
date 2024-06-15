"use client"
import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React,{useEffect, useState} from 'react';
import Webcam from 'react-webcam';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import Link from 'next/link';

function Interview({params}) {

    const [interviewData,setInterviewData] = useState({});
    const [webCamEnabled,setWebCamEnabled] = useState(false);

    useEffect(()=>{
        console.log(params.interviewId)
        GetInterviewDetails();
    },[])

    /*
    used to get interview details by MockId
    */ 

    const GetInterviewDetails=async()=>{
        const result=await db.select().from(MockInterview).where(eq(MockInterview.mockId,params.interviewId))
        // console.log(result[0]);
        setInterviewData(result[0]);
    }


    return (
    <div className='my-10 '>
        <h2 className='font-bold text-2xl'>Let's Get Started</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 '>
            
            <div className='flex flex-col my-5 gap-5 p-5 rounded-lg border'>
                <div className='flex flex-col p-5 rounded-lg border'>
                    <h2 className='text-lg'><strong>Job Role/Position : </strong>{interviewData.jobPosition}</h2>
                    <h2 className='text-lg'><strong>Job Description/Tech Stack : </strong>{interviewData.jobDesc}</h2>
                    <h2 className='text-lg'><strong>Years of Experience : </strong>{interviewData.jobExperience}</h2>
                </div>
                <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
                    <h2 className='flex gap-2 items-center text-orange-600'><Lightbulb/><strong>Information</strong></h2>
                    <h2 className='mt-3'>Please enable you Web Cam and Microphone to start your mock Interview.
                    The Interview consists of 5 questions which you can answer and record and at the end you will recieve you grade and feedback for the Interview. All THE BEST!
                    </h2>
                </div>
            </div>

            <div>
                {webCamEnabled?<Webcam
                onUserMedia={()=>setWebCamEnabled(true)}
                onUserMediaError={()=>setWebCamEnabled(false)}
                mirrored={true}
                style={{
                    height:300,
                    width:300
                }}
                /> 
                : 
                <>
                <WebcamIcon className='h-72 my-7 w-full p-10 bg-secondary rounded-lg border'/>
                <Button variant='ghost' className='w-full' onClick={()=>setWebCamEnabled(true)}>Enable Webcam and microphone</Button>
                </>
                }
            </div>
        </div>
        <div className='flex justify-end items-end'>
            <Link href={'/dashboard/interview/'+params.interviewId+'/start'}>
                <Button>Start Interview</Button>
            </Link>
        </div>
    </div>
  )
}

export default Interview