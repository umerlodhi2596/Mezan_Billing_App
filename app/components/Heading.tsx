import React from 'react'

interface HeadingProp {
    heading: string,
}

export default function Heading({heading}: HeadingProp) {
  return (
    <>
        <h2 className='text-2xl text-white py-5 border-b border-gray-500'>{heading}</h2>
    </>
  )
}
