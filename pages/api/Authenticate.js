import { async } from "@firebase/util"
import { getDocs, getDoc, query, collection, where, setDoc, doc, addDoc } from "firebase/firestore"
import { Result } from "postcss"
import { db } from "../../utils/firebase"
const bcrypt = require("bcrypt")
import { serialize } from 'cookie';
var jwt = require('jsonwebtoken');

export default async function handler(req, res) {

    // if (req.method !== 'POST'){
    //   res.status(405).json({ error: 'You need to post to this' })
    // }

    const data = JSON.parse(req.body)
    let email  = data.email
    email = email.toLowerCase()
    const password = data.password
    let username = data.username
    username = username.toLowerCase()
    const docref = collection(db, "users")
    const usernameq = query(docref, where("username", "==", username));
    const emailq = query(docref, where("email", "==", email));
    const docSnap = await getDocs(usernameq);
    
    if(docSnap.docs.length === 0){
      const emailSnap = await getDocs(emailq);
      let hashedPassword = ""
      if(emailSnap.docs.length === 0){
        hashedPassword= await bcrypt.hash(password, 10)
        const newDoc = await addDoc(docref, {
          username: username,
          password: hashedPassword,
          email: email,
          bio: "",
          profileBg: "",
          profileImg: "",
          following: [],
          followers: []
        });
        const token = jwt.sign({
          data: email
        }, 'secret', { expiresIn: '4d'});
        res.setHeader('Set-Cookie', serialize('token',  token, { path: '/' }));
        res.status(200).json({ success: true })
      } else {
        res.status(500).json({ message: 'Email alreaday exists' })
      }
    } else {
      res.status(500).json({ message: 'Username alreaday exists' })
    }


  }
  