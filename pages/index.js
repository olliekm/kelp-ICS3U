import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import Layout from '../components/Layout'
import { useContext, createContext, useState } from 'react';
import * as cookie from 'cookie'
const jwt = require('jsonwebtoken')
import { getDocs, doc, query, collection, where } from 'firebase/firestore'
import { db } from '../utils/firebase'

const AuthProvider = createContext(null)
export default function Home({auth, userData}) {
  const [userInfo, setsetUserInfo] = useState(userData)
  const [isAuth, setIsAuth] = useState(auth)
  const [banner, setBanner] = useState(true)
  return (
    <AuthProvider.Provider value={isAuth} userInfo={userInfo}>
    <>
     <div className="w-full h-auto min-h-screen bg-gray-200 ">
      {
        banner &&
      <div className="w-full h-auto flex justify-center text-white bg-emerald-600">
        <strong className='pr-1'>Kelp</strong>    is still in development
      </div>
      }
      <div className="w-full md:fixed md:bottom-0 md:left-0 md:p-10 p-5 flex justify-between items-center">
        <div className="">
          <h1 className='font-bold text-6xl text-emerald-700 font-roboto'>Kelp🌿</h1>
          <h2 className='p-2 font-semibold'>A programming forum</h2>
        </div>
      </div>
      <Layout isAuth={isAuth} userInfo={userInfo} />
     </div>
    </>
    </AuthProvider.Provider>
  )
}

export async function getServerSideProps(context) {
  // Fetch data from external API
  let auth = false
  let userData = {}
  const citiesRef = collection(db, "users");
  if (context.req.headers.cookie){
    let token = cookie.parse(context.req.headers.cookie)
    if (token.token !== '' ){
      const decoded = jwt.verify(token.token, 'secret',(err, decoded) => {
        if (err) {
          context.res.setHeader(
            "Set-Cookie", [
            `token=deleted; Max-Age=0`,]
          );
          return { props: { 
            auth: auth,
            userData: userData
           } }         
        }
        token = decoded.data
      }
      )
      const q = query(citiesRef, where("email", "==", token));
      const docSnap = await getDocs(q);
      docSnap.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          userData = doc.data()
          auth = true
        });
    }
  }
  
  // Pass data to the page via props
  return { props: { 
    auth: auth,
    userData: userData
   } }
}