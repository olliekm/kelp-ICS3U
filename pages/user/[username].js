import React, {useEffect, useState} from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { async } from '@firebase/util'

function userPage() {

    const router = useRouter()
    const { username } = router.query

    const [loading, setLoading] = useState(true)
    const [allResults, setAllResults] = useState()
    let userInfo = {}
    const [posts, setPosts] = useState([])
    const [editMenu, setEditMenu] = useState(false)
    const [profileLink, setProfileLink] = useState('')
    const [profileBg, setProfileBg] = useState('')
    const [Bio, setBio] = useState('')
    const [PreventSpam, setPreventSpam] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)

    useEffect(() => {
        console.log(username)
        if(username !== undefined){
            let res = fetch('/api/getUser', {
                method:"POST",
                body: JSON.stringify({  
                    username: username,
                })
            }) 
                .then((res) => res.json())
                .then((data) => {
                    const result = JSON.parse(data.data) 
                    console.log(result)
                    setAllResults(result)
                    setLoading(false)
                    setIsFollowing(result.isFollowing)
                })
        }
    }, [username])
    
    async function saveProfile(){
        let res = fetch('/api/editprofile', {
            method:"POST",
            body: JSON.stringify({  
                profileBg: profileBg,
                profileImg: profileLink,
                bio: Bio,
                username: username
            })
        }) 
            .then((res) => {
                setEditMenu(false)
            })
    }

    async function unfollow(){
        setPreventSpam(true)
        let res = fetch('/api/unfollow', {
            method:"POST",
            body: JSON.stringify({  
                username: username
            })
        }) 
            .then((res) => {
                if (res.status == 200){
                    setIsFollowing(false)
                }
                setPreventSpam(false)
            })
    }

    async function follow(){
        setPreventSpam(true)
        let res = fetch('/api/follow', {
            method:"POST",
            body: JSON.stringify({  
                username: username
            })
        }) 
            .then((res) => {
                if (res.status == 200){
                    setIsFollowing(true)
                }
                setPreventSpam(false)
            })
    }

  return (
    <div className='w-full min-h-screen bg-gray-200 flex justify-center flex-col items-center'>
        {
            !loading && !allResults.selfCheck &&
            <div className="fixed bottom-0 w-full z-20 flex justify-center items-center p-5">
                {
                    isFollowing  ? (
                        <button onClick={() => unfollow()} disabled={PreventSpam} className='w-auto p-3 px-10 shadow-xl shadow-emerald-300 hover:scale-105 hover:shadow-2xl hover:bg-emerald-500 duration-150 bg-emerald-600 font-bold text-white rounded-2xl text-2xl'>Unfollow</button>
                    ):(
                        <button onClick={() => follow()} disabled={PreventSpam} className='w-auto p-3 px-10 shadow-xl shadow-emerald-300 hover:scale-105 hover:shadow-2xl hover:bg-emerald-400 duration-150 bg-emerald-500 font-bold text-white rounded-2xl text-2xl'>Follow</button>
                    )
                }
            </div>
        }
        {
            editMenu &&
            <div className="w-full fixed z-30 top-0 h-screen bg-black/50 backdrop-blur-sm flex justify-center items-center">
                <div className="xl:w-3/6 w-full overflow-hidden lg:w-4/6 md:5/6 bg-gray-200 min-h-96 flex-col flex p-10 rounded-2xl">
                    <h1 className='font-bold text-2xl pb-10'>Edit Profile</h1>
                    <input type="text" className='text-3xl outline-none p-5 rounded-2xl mb-5' placeholder='Profile picture link' value={profileLink} onChange={(e) => setProfileLink(e.target.value)} />
                    <input type="text" className='text-3xl outline-none p-5 rounded-2xl mb-5' placeholder='Profile banner link' value={profileBg} onChange={(e) => setProfileBg(e.target.value)} />
                    <input type="text" maxLength={40} className='text-3xl outline-none p-5 rounded-2xl mb-5' placeholder='Profile bio' value={Bio} onChange={(e) => setBio(e.target.value)} />

                    <button onClick={() => saveProfile()} className='text-2xl bg-emerald-600 rounded-2xl py-4 font-semibold text-white'>Save</button>
                </div>
            </div>
        }

        <div className=" top-0 w-full h-auto flex justify-center text-white bg-emerald-600">
            <strong className='pr-1'>Kelp</strong>    is still in development
        </div>
        { !loading && allResults.userData.email !== undefined ? (
        <div className="xl:w-3/6 w-full overflow-hidden lg:w-4/6 md:5/6 min-h-screen bg-gray-300/50 relative">
            <div className="w-full h-48 overflow-hidden flex items-center absolute bg-black z-0">
                <img className='w-full opacity-50' src={allResults.userData.profileBg} alt="" />
            </div>
            <div className="flex items-center space-x-4 h-48 px-10">
                {
                    allResults.selfCheck ? (
                        <div onClick={() => setEditMenu(true)} className="w-32 h-32 rounded-full shrink-0 overflow-hidden z-10 border-2 border-emerald-600 group">
                            <img className='h-full group-hover:hidden' src={allResults.userData.profileImg} alt="" />
                            <div className="w-full h-full bg-emerald-600 flex justify-center items-center text-center duration-150 cursor-pointer">
                                <h1 className='font-bold text-white'>Change profile picture</h1>
                            </div>
                        </div>
                    ):(
                        <div className="w-32 h-32 rounded-full shrink-0 overflow-hidden z-10 border-2 border-emerald-600">
                            <img className='h-full' src={allResults.userData.profileImg} alt="" />
                        </div>
                    )
                }
                <h1 className='text-gray-200 text-6xl font-bold z-10'>@{allResults.userData.username}</h1>
            </div>
            <div className="w-full flex items-center justify-center text-xl py-4">
                {allResults.userData.bio}
            </div>
            <div className="w-full flex items-center justify-left text-2xl p-4 space-x-3">
                <small>
                Followers: {allResults.userData.followers?.length}
                </small>
                <small>
                Following: {allResults.userData.following?.length}
                </small>
            </div>
            <div className="w-full p-5 space-y-5">
            {
                allResults.posts?.map((post) => (
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
        ):(
            <div className="min-h-screen w-full flex justify-center items-center">
                <h1 className='text-3xl font-bold'>Loading profile of {username}</h1>
            </div>
        )
        }
    </div>
  )
}

export default userPage