'use client';
import React from "react";
import ScrollableCardHolder from "@/app/components/it-admin/ScrollabelCardHolder";
import { MemberTable } from "@/app/components/it-admin/CompanyUsersTable";

const AdminPage: React.FC = () => {
  return (
    <>
      <ScrollableCardHolder />
      <MemberTable/>
    </>  
  );
}

export default AdminPage;
