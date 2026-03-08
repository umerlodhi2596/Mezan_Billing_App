import React from "react";
import UsersTable from "../../components/UserTable";
import Heading from "../../components/Heading";

export default function AdminsPage() {
  return (
    <>
      <section className="px-10 py-6">
        <Heading heading="Admins" />
        <div className="pt-5">
          <UsersTable />
        </div>
      </section>
    </>
  );
}
