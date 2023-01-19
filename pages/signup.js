import React, {useState} from 'react'
import Router from 'next/router'

function signup() {

    const [isMessage, setIsMessage] = useState(false)
    const [messageContent, setMessageContent] = useState('ERROR:')

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')

    function signUp(){
        if(email !== '' && password !== '' && username !== ''){
            fetch('/api/Authenticate',{
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    username: username,
                    password: password
                })
            })
            .then((res) => {
                if(res.status == 200){
                    Router.push('/')
                } else {
                    setMessageContent("Error: username or email in use")
                    setIsMessage(true)
                    setEmail('')
                    setUsername('')
                    setPassword('')
                }
            })
        } else {
            setMessageContent('Please fill in all the feilds')
            setIsMessage(true)
        }
    }

  return (
    <div className='min-h-screen h-auto bg-gray-200 w-full flex justify-center items-center'>
    { isMessage &&
    <div className="fixed top-0 w-full flex justify-center p-3">
        <div className="w-96 h-12 text-white font-bold px-4 bg-red-600 rounded-2xl flex justify-between items-center">
            <h1>{messageContent}</h1>
            <svg xmlns="http://www.w3.org/2000/svg" onClick={() => setIsMessage(false)} className='fill-white w-4 h-4 cursor-pointer' viewBox="0 0 320 512"><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg>
        </div>
    </div>
    }
    <div className="min-w-96 max-w-full min-h-96 max-h-auto bg-gray-100 flex flex-col p-5 rounded-2xl">
        <div className="p-3">
            <h1 className='font-bold text-6xl text-emerald-700 font-roboto'>Kelp🌿</h1>
            <h2 className='p-2 font-semibold'>A programming forum</h2>
        </div>
        <input type="text"  value={username} onChange={(e) => setUsername(e.target.value)} className='p-2 text-lg rounded-xl outline-none mb-2' placeholder='Username' />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className='p-2 text-lg rounded-xl outline-none mb-2' placeholder='John.Doe@email.com' />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className='p-2 text-lg rounded-xl outline-none mb-2' placeholder='********' />
        <button onClick={() => signUp()} className='p-4 rounded-xl bg-green-700 hover:bg-green-600 text-white font-roboto uppercase font-semibold '>Sign up</button>
    </div>
</div>
    )
}

export default signup