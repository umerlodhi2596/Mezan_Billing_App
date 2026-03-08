import Heading from "../../../components/Heading";
import React from "react";
import UpdateInvoiceItem from "../../../components/UpdateInvoiceItem";

export default async function UpdateInvoicePage() {
  
  return (
    <>
      <section className="px-10 py-6">
        <Heading heading="Update Invoice" />
        <div className="pt-5">
          <UpdateInvoiceItem />
        </div>
      </section>
    </>
  );
}
