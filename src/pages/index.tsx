import HomePage from '@/components/HomePage/HomePage';
import Layout from '@/components/Layout/Layout';
import styles from '@/styles/Home.module.css';
import { observer } from 'mobx-react-lite';
import Head from 'next/head';
import React from 'react';

const Home: React.FC = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>Map - Main</title>
      </Head>
      <main className='main'>
        <HomePage />
      </main>
    </>
  )
}

export default observer(Home);
