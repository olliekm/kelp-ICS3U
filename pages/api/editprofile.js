import { where, getDocs, query, addDoc, collection, doc, updateDoc } from "firebase/firestore";
import * as cookie from 'cookie'
const jwt = require('jsonwebtoken')
import { db } from "../../utils/firebase";


export default async function handler(req, res) {
    const data = JSON.parse(req.body)
    const citiesRef = collection(db, "users")
    let bio = data.bio
    let profile = data.profileImg
    let banner = data.profileBg
    let username = data.username
    let auth = false
    if (req.headers.cookie){
        let token = cookie.parse(req.headers.cookie)
        if (token.token !== '' ){
            const decoded = jwt.verify(token.token, 'secret');
            const q = query(citiesRef, where("email", "==", decoded.data));
            const docSnap = await getDocs(q);
            let userid = ''
            let requsername = ''
            docSnap.forEach((doc) => {
                userid = doc.id
                requsername = doc.data().username
                console.log("WEWEWEW")
            });
            if(String(requsername) == String(username)){
                const newRef = doc(db, "users", userid);
                console.log("EDITING")
                // Set the "capital" field of the city 'DC'
                await updateDoc(newRef, {
                    profileBg: banner,
                    profileImg: profile,
                    bio: bio
                });

                // const newDoc = await addDoc(docref, {
                //     title: title,
                //     content: content,
                //     authorid: username,
                //     isVerified: true,
                //     likes: [],
                //     profileImg: "",
                //     createdAt: Date.now()
                // });
                res.status(200).json({success:"Edited"})
            } else {
                res.status(500).json({error:"NO TOKEN"})
            }
        }
    } else {
        res.status(500).json({error:"NO TOKEN"})
    }
}
    