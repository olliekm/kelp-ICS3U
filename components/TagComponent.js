import React, {useState} from 'react'

function TagComponent({text}) {

    const [isActive, setIsActive] = useState(false)

  return (
    <div onClick={() => setIsActive(!isActive)} className={`cursor-pointer shrink-0 ${isActive ? 'border border-1 border-green-600 text-emerald-600' : ''} select-none min-w-24 px-4 h-full bg-gray-200 rounded-full flex justify-center items-center`}>
    {text}
    </div>
  )
}

export default TagComponent