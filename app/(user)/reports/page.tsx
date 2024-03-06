'use client';
import React from "react";
import ScrollableCardHolder from "@/app/components/Admin/ScrollabelCardHolder";
import { MemberTable } from "@/app/components/Admin/CompanyUsersTable";
import withAuth from "@/app/auth/withAuth";

const AdminPage: React.FC = () => {
  return (
    <>
      <p>Reports</p>
    </>  
  );
}

export default withAuth(AdminPage, ['admin']);
