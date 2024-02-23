'use client';
import React from "react";
import ScrollableCardHolder from "@/app/components/it-admin/ScrollabelCardHolder";
import { MemberTable } from "@/app/components/it-admin/CompanyUsersTable";
import withAuth from "@/app/auth/withAuth";

const AdminPage: React.FC = () => {
  return (
    <>
      <ScrollableCardHolder />
      <MemberTable/>
    </>  
  );
}

export default withAuth(AdminPage);
