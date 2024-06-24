"use client"
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
  

function Feedback({params}) {

    const [feedbackList,setFeedbackList] = useState([]);
    const [overallRating, setOverallRating] = useState(null);
    const router=useRouter();

    useEffect(()=>{
        GetFeedback();
    },[])

    const GetFeedback=async()=>{
        const result = await db.select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef,params.interviewId))
        .orderBy(UserAnswer.id);

        console.log(result);
        setFeedbackList(result);
        calculateOverallRating(result);
    }

    const calculateOverallRating = (feedbackList) => {
        if (feedbackList.length === 0) {
            setOverallRating(0);
            return;
        }

        const totalRating = feedbackList.reduce((sum, item) => sum + item.rating, 0);
        const averageRating = (totalRating / feedbackList.length).toFixed(1);
        setOverallRating(averageRating);
    }
    
  return (
    <div className='p-10'>
        

        {feedbackList?.length==0?
        <h2 className='font-bold text-xl text-gray-500'>No Interview Feedback Record Found</h2>
        :
        <>
        <h2 className='text-3xl font-bold text-green-500'>Congratulations</h2>
        <h2 className='font-bold text-2xl'>Here is your Interview Feedback</h2>

        <h2 className='text-lg my-3 text-primary'>Your overall interview rating: <strong>{overallRating}/10</strong></h2>

        <h2 className='text-sm text-gray-500'>Analyze the verdict of your interview below...</h2>

        {feedbackList&&feedbackList.map((item,index)=>(
            <Collapsible key={index} className='mt-7'>
            <CollapsibleTrigger className='p-2 bg-secondary rounded-lg my-2 text-left flex justify-between gap-7 w-full'>
            {item.question} <ChevronsUpDown className='h-5 w-5'/>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className='flex flex-col gap-2'>
                <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating : </strong>{item.rating}</h2>
                <h2 className='p-2 border rounded-lg bg-red-50 text-am'><strong>Your Answer : </strong>{item.userAns}</h2>
                <h2 className='p-2 border rounded-lg bg-green-50 text-am'><strong>Sample Correct Answer : </strong>{item.correctAns}</h2>
                <h2 className='p-2 border rounded-lg bg-yellow-50 text-am'><strong>Your Feedback : </strong>{item.feedback}</h2>
              </div>
            </CollapsibleContent>
          </Collapsible>          
        ))}
        </>
        }
        <Button onClick={()=>router.replace('/dashboard')}>Go Home</Button>
    </div>
  )
}

export default Feedback

