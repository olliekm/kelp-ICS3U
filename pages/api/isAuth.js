import { serialize, coo } from 'cookie';

export default function handler(req, res) {
    console.log(res.cookie.get())
    res.status(200).json({ name: 'John Doe' })
  }
  