'use client';
import React from "react";
import ScrollableCardHolder from "@/app/components/UserAdmin/ScrollabelCardHolder";
import { MemberTable } from "@/app/components/UserAdmin/CompanyUsersTable";
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
