import React, {useEffect, useState} from 'react'
import { db } from '../../utils/firebase'
import { getDoc, collection, getDocs, doc, query, orderBy, limit, } from 'firebase/firestore'
import Link from 'next/link'

function ViewPost({post}) {
    let data = JSON.parse(post)

    const [topPosts, setTopPosts] = useState([])

    async function getTop(){
        const q = query(collection(db,'posts'), orderBy("likes"), limit(3));
        let newPosts = await getDocs(q);
        newPosts.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            setTopPosts(topPosts => [[doc.id,doc.data()],...topPosts])
        });
    }
    useEffect(() => {
        getTop()
    }, [])
    
  return (
    <div className='w-full min-h-screen bg-gray-200 flex flex-col items-center '>
        <div className=" top-0 w-full h-auto flex justify-center text-white bg-emerald-600">
            <strong className='pr-1'>Kelp</strong>    is still in development
        </div>
        <div className="xl:w-3/6 relative lg:w-4/6 md:5/6 pt-20 min-h-screen bg-gray-300/50 px-10 flex-col justify-between flex">
            <div className="absolute top-0 left-0 p-4">
                <Link href={'/'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className='w-8 h-8' viewBox="0 0 16 16">
                        <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                    </svg>
                </Link>
            </div>
            <div className="">
            <h1 className='font-bold text-7xl'>
            {data.title}
            </h1>
            <Link href={`/user/${data.authorid}`}>
                <small className='text-xl font-bold text-emerald-700'>@{data.authorid}</small><br />
            </Link>
            <p className='pt-10 flex-1 text-2xl'>{data.content}</p>
            </div>            


            <div className="flex flex-col items-center pt-10">
                {
                    topPosts.length > 0 &&
                <h1 className='text-3xl font-bold'>You may also like</h1>
                }
                <div className="flex pb-10 sm:flex-row flex-col sm:space-y-0 space-y-4 mt-4 items-center justify-center">

                    {
                        topPosts?.map((post) => (
                            <div key={post[0]} className="group h-56 md:w-auto w-full bg-gray-200 rounded-2xl  flex flex-col shadow-2xl shadow-emerald-600/40 hover:scale-105 duration-150">
                                <Link href={`/post/${post[0]}`} className="flex-1 p-4">
                                    <div >                                    
                                        <h1 className='text-2xl font-bold'>
                                        {post[1].title} 
                                        </h1>
                                        <small className='font-bold text-lg text-emerald-700'>@{post[1].authorid}</small><br />
                                        <small>{Date(post[1].createdAt * 1000)}</small>
                                        <p className='max-h-6 overflow-hidden'>{post[1].content}</p>
                                    </div>
                                </Link>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    </div>
  )
}
export async function getServerSideProps(context) {
    const id = context.query.postid 
    const docRef = doc(db, 'posts', id)
    const post = await getDoc(docRef)
    const data = JSON.stringify(post.data())
    return {
        props: {
            post: data
        }
    }
}
export default ViewPost