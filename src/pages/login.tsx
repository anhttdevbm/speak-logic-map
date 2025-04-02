import React, { memo } from "react";
import LoginForm from "@/components/Login/LoginForm";
import Head from 'next/head';

const Login: React.FC = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>Map - Login</title>
      </Head>
      <main className="main">
        <LoginForm />
      </main>
    </>
  )
};
export default memo(Login);
