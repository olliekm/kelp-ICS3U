import { async } from "@firebase/util"
import { getDocs, getDoc, query, collection, where, setDoc, doc, addDoc } from "firebase/firestore"
import { Result } from "postcss"
import { db } from "../../utils/firebase"
const bcrypt = require("bcrypt")
import * as cookie from 'cookie'
var jwt = require('jsonwebtoken');

export default async function handler(req, res) {
    let data = {
        selfCheck: false,
        posts: [],
        userData: {},
        isFollowing: false,
        sender: ''
    }
    const payload = JSON.parse(req.body)
    if (req.headers.cookie){
        let token = cookie.parse(req.headers.cookie)
        if (token.token !== ''){

            const decoded = jwt.verify(token.token, 'secret');
            const username = String(payload.username)
            console.log(username)
            const firstQuery = query(collection(db, 'users'), where("username", "==", username));
            const initialDocs = await getDocs(firstQuery);
            console.log("WOW")
            initialDocs.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                let userInfo = doc.data()
                console.log(doc.id)
                userInfo.password = ''
                data.userData = userInfo
            });
            console.log(data.userData.email)
            if (data.userData.email == decoded.data){
                data.selfCheck = true
            } else {
                if (data.userData.followers.includes(decoded.data)){
                    data.isFollowing = true
                }
            }
            const newq = query(collection(db, 'posts'), where("authorid", "==", payload.username));
            const newdocSnap = await getDocs(newq);
            newdocSnap.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots                auth = true
                data.posts.push([doc.id,doc.data()])
            });
            // console.log(data)
            res.status(200).json({ data: JSON.stringify(data) })
        }
    } else {
        console.log("ERROR")
        res.status(500).json({ error: "ERROR" })
    }




  }
  