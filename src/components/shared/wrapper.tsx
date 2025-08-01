import React,{FC} from 'react'

const wrapper:FC<{children:React.ReactNode}> = ({children}) => {
  return (
    <div className='max-w-[1342px] mx-auto w-full'>
        {children}
    </div>
  )
}

export default wrapper