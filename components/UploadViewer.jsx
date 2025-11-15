import React from 'react'

const UploadViewer = ({uploads , setUploads}) => {
  return (
    <div className='w-full h-full flex flex-col p-3 gap-y-2 overflow-x-hidden overflow-y-scroll scrollbar'>
      {
        uploads.map((file, index) => (
          <div key={index} className='w-full min-h-20 max-h-20 flex justify-between items-start bg-[#ffffff11]  border-[1px] border-[#fafafa]/30 p-1 rounded-md overflow-hidden'>
            <div className='aspect-video h-full bg-[#ffffff11] rounded-md overflow-hidden'>
              <img src={file.url ? file.url : "File.png"} alt='upload' className='w-full h-full object-cover'/>
            </div>
            <div className='flex-1 w-full h-full px-3 text-sm sm:text-base '>
              {file.name}
            </div>
            <button className='rounded-sm p-1 bg-red-500 hover:bg-red-400' onClick={() => {
              const newUploads = [...uploads]
              newUploads.splice(index, 1)
              setUploads(newUploads)
            }}>
              <div className=' aspect-square h-full  rounded-md overflow-hidden'>
              <img src="/Delete.svg" alt='upload' className='w-full h-full object-cover'/>
            </div>
            </button>
          </div>
        ))
      }
    </div>
  )
}

export default UploadViewer