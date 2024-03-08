'use client';
import React from "react";
import ScrollableCardHolder from "@/app/components/Admin/ScrollabelCardHolder";
import { MemberTable } from "@/app/components/Admin/CompanyUsersTable";
import withAuth from "@/app/auth/withAuth";
import Link from "next/link";

const AdminPage: React.FC = () => {
  return (
    <>
      <ScrollableCardHolder />
      <MemberTable/>

    </>  
  );
}

export default withAuth(AdminPage, ['admin']);


