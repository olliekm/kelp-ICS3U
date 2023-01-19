import React from 'react'
import TagComponent from './TagComponent'
import {collection, doc, getDocs, query, orderBy, limit} from 'firebase/firestore'
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { db } from '../utils/firebase';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';

function Layout({isAuth, userInfo}) {
    
    const [postTitle, setPostTitle] = useState('')
    const [postContent, setPostContent] = useState('')

    const [postOpen, setPostOpen] = useState(false)
    const [postsLoading, setPostsLoading] = useState(false)
    const postRef = collection(db, "posts");
    const [posts, setPosts] = useState([])
    const [topPosts, setTopPosts] = useState([])
    async function getAll(){
        setPostsLoading(true)
        let newPosts = await getDocs(collection(db, "posts"));
        newPosts.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            setPosts(posts => [[doc.id,doc.data()],...posts])
        });
        setPostsLoading(false)
    }

    async function getTop(){
        const q = query(collection(db,'posts'), orderBy("likes"), limit(3));
        let newPosts = await getDocs(q);
        newPosts.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            setTopPosts(topPosts => [[doc.id,doc.data()],...topPosts])
        });
        console.log(topPosts)
    }

    useEffect(() => {
        getAll()
        getTop()
    }, [])

    function post(){
        if(postTitle !== '' && postContent !== '' && isAuth){
            fetch('/api/post',{
                method: 'POST',
                body: JSON.stringify({
                    content: postContent,
                    title: postTitle
                })
            })
            .then((res) => {
                if(res.status == 200){
                    Router.push('/')
                }   
                setPostOpen(false)
            })
        }
    }
    
  return (
    <div className="w-full h-auto md:flex-row flex-col flex  ">
        {
            postOpen && 
            <div className="fixed top-0 w-full h-full z-30 backdrop-blur-sm bg-black/50 flex justify-center items-center   ">
                <div className="xl:w-1/2 w-4/5 xl:min-h-96 min-h-[90vh] h-auto rounded-2xl bg-gray-100 relative">
                    <div className="absolute top-0 right-0 p-5">
                        <button onClick={() => setPostOpen(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className='w-7 h-7' viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                        </svg>
                        </button>
                    </div>
                    <div className="flex flex-col w-full p-10">
                        <label htmlFor="" className='p-3 text-2xl'>Title</label>
                        <input type="text" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} maxLength="60" placeholder="Title" className="text-3xl py-3 px-5 outline-none rounded-2xl" />
                        <label htmlFor="" className='p-3 text-2xl'>Content</label>
                        <textarea onChange={(e) => setPostContent(e.target.value)} value={postContent} name="" id="" cols="30" rows="10" maxLength="1000" className=" resize-none text-xl py-3 px-5 outline-none rounded-2xl"></textarea>
                        <label htmlFor="" className='p-3 text-2xl'>Tags coming soon...</label>
                        <div className="w-full">
                            <button onClick={() => post()} className='text-3xl hover:bg-emerald-600 bg-emerald-700 text-white px-6 py-4 w-full rounded-2xl'>Post</button>
                        </div>
                    </div>

                </div>
            </div>
        }
        <div className="xl:w-1/4 md:w-72 p-10 md:block hidden w-full">
        </div>
        <div className="xl:w-1/4 md:w-72 w-full  md:p-10 p-5 md:block md:fixed shrink-0">
            <div className={`bg-gray-300 shadow-sm md:h-96 rounded-2xl overflow-hidden`}   >
                {
                    !isAuth ?
                    (
                        <div className="h-full flex w-full justify-center items-center flex-col">
                            <h1 className='text-xl mb-5'>Not logged in</h1>
                            <Link href={'/login'}>
                                <button className='text-3xl font-semibold hover:bg-emerald-600 bg-emerald-700 text-white px-10 py-5 rounded-2xl'>
                                    Log in
                                </button>
                            </Link>
                        </div>
                    ):(
                    <div className="relative ">
                        <div className="w-full z-0 h-24 absolute bg-black overflow-hidden flex justify-center items-center">
                            <img className='w-full opacity-50' src={userInfo.profileBg} alt="" />
                        </div>
                        <div className="flex items-center space-x-4 p-5">
                            <div className={`w-20 h-20 rounded-full shrink-0 overflow-hidden z-10`}>
                                    <img className='object-cover h-full' src={userInfo.profileImg} alt="" />
                                </div>
                            <div className="flex-col z-10 ">
                                <Link href={`/user/${userInfo.username}`}>
                                    <h1 className='font-bold text-2xl text-emerald-200'>{userInfo.username}</h1>
                                </Link>
                                <p className='text-emerald-600'>{userInfo.bio}</p>
                            </div>
                        </div>
                        <div className="flex space-x-2 text-xl px-10 font-semibold">
                            <small>Follower: {userInfo.followers.length}</small>
                            <small>Following: {userInfo.following.length}</small>
                        </div>
                    </div>
                    )
                }
            </div>
        </div>
        <div className='xl:w-2/4 w-full md:w-3/6 md:flex-1 xl:mr-0 md:mr-10 mr-0 min-h-screen h-auto md:pt-10'>
            <div className="bg-gray-300 h-full w-full md:rounded-t-2xl flex flex-col">
                <div className="w-full flex p-8">
                    <input  disabled={!isAuth} maxLength="60"  onChange={(e) => setPostTitle(e.target.value)} value={isAuth ? postTitle : "You cannot post until you log in"} type="text" placeholder='What would you like to post about?' className='disabled:bg-emerald-700 disabled:text-white flex-1 text-xl p-4 bg-gray-100/90 rounded-l-2xl outline-none' />
                    <button onClick={() => setPostOpen(true)} disabled={!isAuth} className='p-4 bg-emerald-600 hover:bg-text-emerald-700-500 duration-150 rounded-r-xl group'>
                        <svg xmlns="http://www.w3.org/2000/svg" className='w-8 h-8 fill-white ease-in-out group-hover:rotate-180 duration-200' viewBox="0 0 16 16">
                            <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                        </svg>
                    </button>
                </div>
                <div className="pl-8 font-bold sticky top-0 py-4 w-full bg-gray-300 flex">
                    <h1 className='text-4xl '>What's happening</h1>
                    {/* <div className="flex-1  overflow-x-hidden">
                        <div className="scroll space-x-2 w-auto overflow-x-auto flex h-full pl-5 pr-4 ">
                            <TagComponent text='webdev'/>
                            <TagComponent text='react'/>
                            <TagComponent text='CCC'/>
                            <TagComponent text='python'/>
                            <TagComponent text='next js'/>
                            <TagComponent text='ios'/>
                            
                        </div>
                    </div> */}
                </div>
                <div className="flex-1 px-8">
                    {
                        postsLoading ? (
                            <div className="w-full text-3xl flex justify-center p-10 font-semibold font-roboto">
                                <h1>Loading ...</h1>
                            </div>
                        ):(

                                posts.map((post) => (
                                    <div key={post[0]} className="group min-h-52 w-full bg-gray-200 rounded-2xl overflow-hidden flex flex-col mb-6 shadow-xl shadow-emerald-900/40 hover:scale-105 duration-150">
                                        <Link href={`/post/${post[0]}`} className="flex-1 p-8">
                                            <div >                                    
                                                <h1 className='text-3xl font-bold'>
                                                {post[1].title} 
                                                </h1>
                                                <small className='font-bold text-xl text-emerald-700'>@{post[1].authorid}</small><br />
                                                <small>{Date(post[1].createdAt * 1000)}</small>
                                                <p className='max-h-6 overflow-hidden'>{post[1].content}</p>
                                            </div>
                                        </Link>
                                        <div className="h-10 w-full group-hover:bg-emerald-700 duration-150 bg-emerald-800 px-4 flex items-center">
                                            <div className="flex items-center text-white">
                                            </div>
                                        </div>
                                    </div>
                                ))
                            
                        )
                    }

                </div>
            </div>
        </div>
        <div className="min-h-1/2 w-1/4  p-10 xl:block hidden">

        </div>
        <div className="min-h-1/2 w-1/4  p-10 xl:block hidden fixed right-0">
            <div className="bg-gray-300 shadow-sm w-full min-h-96 max-h-auto rounded-2xl p-3 space-y-3">
            <h1 className='text-2xl font-bold'>Top 3 posts:</h1>
            {
                topPosts?.map((post) => (
                    <div key={post[0]} className="group h-auto w-full bg-gray-200 rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-emerald-600/40 hover:scale-105 duration-150">
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
  )
}

export default Layout