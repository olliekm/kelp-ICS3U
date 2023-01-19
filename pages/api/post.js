import { where, getDocs, query, addDoc, collection } from "firebase/firestore";
import * as cookie from 'cookie'
const jwt = require('jsonwebtoken')
import { db } from "../../utils/firebase";

export default async function handler(req, res) {
    const data = JSON.parse(req.body)
    const citiesRef = collection(db, "users")
    let title = data.title
    let content = data.content
    let auth = false
    if (req.headers.cookie){
        let token = cookie.parse(req.headers.cookie)
        if (token.token !== '' ){
            const decoded = jwt.verify(token.token, 'secret');
            const q = query(citiesRef, where("email", "==", decoded.data));
            const docSnap = await getDocs(q);
            let userid = ''
            let username = ''
            docSnap.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                auth = true
                userid = doc.id
                username = doc.data().username
                console.log(username)
            });
            const docref = collection(db, "posts")
            if(userid.length > 0){
            const newDoc = await addDoc(docref, {
                title: title,
                content: content,
                authorid: username,
                isVerified: true,
                likes: [],
                profileImg: "",
                createdAt: Date.now()
              });
              res.status(200).json({success:"Posted"})
              return
            }
            res.status(500).json({error:"NO TOKEN"})
        }
    } else {
        res.status(500).json({error:"NO TOKEN"})
    }
}
    