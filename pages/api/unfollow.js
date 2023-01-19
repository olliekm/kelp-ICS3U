import { where, getDocs, query, addDoc, collection, doc, updateDoc, arrayRemove } from "firebase/firestore";
import * as cookie from 'cookie'
const jwt = require('jsonwebtoken')
import { db } from "../../utils/firebase";


export default async function handler(req, res) {
    const data = JSON.parse(req.body)
    const citiesRef = collection(db, "users")
    let username = data.username
    if (req.headers.cookie){
        let token = cookie.parse(req.headers.cookie)
        if (token.token !== '' ){
            const decoded = jwt.verify(token.token, 'secret');
            const q = query(citiesRef, where("username", "==", username));
            const senderq = query(citiesRef, where("email", "==", decoded.data));
            const docSnap = await getDocs(q);
            let email = ''
            let userid = ''
            docSnap.forEach((doc) => {
                userid = doc.id
                email = doc.data().email
            });
            const docSnap2 = await getDocs(senderq);
            let email2 = ''
            let userid2 = ''
            docSnap2.forEach((doc) => {
                userid2 = doc.id
                email2 = doc.data().email
            });
            await updateDoc(doc(citiesRef, userid2), {
                following: arrayRemove(email)
            });
            
            await updateDoc(doc(citiesRef, userid), {
                followers: arrayRemove(decoded.data)
            });
                res.status(200).json({success:"Edited"})
            } else {
                res.status(500).json({error:"NO TOKEN"})
            }
    } else {
        res.status(500).json({error:"NO TOKEN"})
    }
}
    