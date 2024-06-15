"use client"
import React,{useState} from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { chatSession } from '@/utils/GeminiAIModal';
import { LoaderCircle } from 'lucide-react';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { db } from '@/utils/db';
import { useRouter } from 'next/navigation';



function AddNewInterview() {

    const [openDialog,setOpenDialog] = useState(false);
    const [jobPosition,setJobPosition] = useState();
    const [jobDesc,setJobDesc] = useState();
    const [jobExperience,setJobExperience] = useState();
    const [loading,setLoading] = useState();
    const [jsonResponse,setJsonResponse] = useState([]);
    const {user}=useUser();
    const router=useRouter();

    const onSubmit=async(e)=>{
        setLoading(true);
        e.preventDefault();
        console.log(jobPosition,jobDesc,jobExperience);

        const InputPrompt = "Job Position : "+jobPosition+", Job Description:"+jobDesc+",Job Experience:"+jobExperience+", Depending upon the above job details , generate "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+" frequently asked job question with answers in json format,such that question and answer are field in json";

        const result = await chatSession.sendMessage(InputPrompt);

        const MockJsonResp=(result.response.text()).replace('```json','').replace('```','');
        console.log(JSON.parse(MockJsonResp));
        setJsonResponse(MockJsonResp);

        if(MockJsonResp){
            const resp=await db.insert(MockInterview).values({
                mockId:uuidv4(),
                jsonMockResp:MockJsonResp,
                jobPosition:jobPosition,
                jobDesc:jobDesc,
                jobExperience:jobExperience,
                createdBy:user?.primaryEmailAddress?.emailAddress,
                createdAt:moment().format('DD-MM-yyyy')
            }).returning({mockId:MockInterview.mockId});
        
            console.log("Inserted ID",resp);
            if(resp){
                setOpenDialog(false);
                router.push('/dashboard/interview/'+resp[0]?.mockId);
            }
        }
        else{
            console.log("ERROR");
        }

        setLoading(false);
    }

  return (
    <div>
    <div className='p-10 border-rounder bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
    onClick ={()=>setOpenDialog(true)}
    >
        <h2 className='text-lg text-center'>+ Add New</h2> 
    </div>

    <Dialog open={openDialog}>
        <DialogContent className='max-w-2xl'>
        <DialogHeader>
            <DialogTitle className='text-2xl'>Tell us more about the job are interviewing for</DialogTitle>
            <DialogDescription >
            <form onSubmit={onSubmit}>
            <div>
                <h2>Add Details about the job role below</h2>
                <div className='mt-7 my-3'>
                    <label>
                        Job Role/Position
                    </label>
                    <Input placeholder='Eg:- Full Stack Developer' required
                    onChange={(event)=>setJobPosition(event.target.value)}
                    />
                </div>
                <div className='my-3'>
                    <label>
                        Job Description/Tech Stack
                    </label>
                    <Textarea placeholder='Eg:- React, Angular, Node.js' required
                    onChange={(event)=>setJobDesc(event.target.value)}
                    />
                </div>
                <div className='my-3'>
                    <label>
                        Years of Experience
                    </label>
                    <Input placeholder='Eg:- 5' type="number" max="100" required
                    onChange={(event)=>setJobExperience(event.target.value)}
                    />
                </div>
            </div>
            <div className='flex gap-5 justify-end'>
                <Button type="button" variant='ghost' onClick={()=>setOpenDialog(false)}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                {loading?
                    <>
                    <LoaderCircle className='animate-spin'/>'Generating Questions'</>:'Start Interview'}
                </Button>
            </div>
            </form>
            </DialogDescription>
        </DialogHeader>
        </DialogContent>
    </Dialog>
  </div>
  
  )
}

export default AddNewInterview