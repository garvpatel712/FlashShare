import React from 'react'

export const metadata = {
    title: "FlashShare Chat",
    description: "Store your temporary notes in a chat-like interface",
  };

const layout = ({children}) => {
  return (
    <main className='w-full h-full'>{children}</main>
  )
}

export default layout