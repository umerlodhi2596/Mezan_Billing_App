import React from 'react'
import Heading from '../../components/Heading'
import Invoice from '../../components/Invoice'

export default function CreateInvoicePage() {
  return (
    <>
      <section className='px-10 py-6'>
        <Heading heading='Create Invoice'/>
        <div className='pt-5'>
          <Invoice/>
        </div>
      </section>
    </>
  )
}
