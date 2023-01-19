import { async } from "@firebase/util"
import { getDocs, getDoc, query, collection, where, setDoc, doc, addDoc } from "firebase/firestore"
import { db } from "../../utils/firebase"
const bcrypt = require("bcrypt")
import { serialize } from 'cookie';
var jwt = require('jsonwebtoken');

export default async function handler(req, res) {

    // if (req.method !== 'POST'){
    //   res.status(405).json({ error: 'You need to post to this' })
    // }
    const citiesRef = collection(db, "users");

    const data = JSON.parse(req.body)
    let email  = data.email
    email = email.toLowerCase()
    const password = data.password
    const q = query(citiesRef, where("email", "==", email));
    const docSnap = await getDocs(q);
    let userData = ''
    docSnap.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        userData = doc.data()
      });
    
    if(userData){
        const pass = userData.password
        bcrypt.compare(password, pass, function(err, result) {
            if (err){
                console.log('qwe')
                return res.status(500).json({ message: 'Username alreaday exists' })
            }
            if (result) {
                console.log('yo')
                const token = jwt.sign({
                    data: email
                }, 'secret', { expiresIn: '7d'} );
                res.setHeader('Set-Cookie', serialize('token',  token, { path: '/' }));
                return res.status(200).json({ success: true })
            } else {
              // response is OutgoingMessage object that server response http request
              return res.status(500).json({success: false, message: 'passwords do not match'});
            }
          }); 
    } else {
      res.status(500).json({ message: 'Email does not exist' })
    }


  }
  