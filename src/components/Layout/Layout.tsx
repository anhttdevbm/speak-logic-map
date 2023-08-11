import Head from 'next/head';
import React from 'react';
import styles from './_Layout.module.scss';

interface Props {
  children: React.ReactNode;
}


const Layout: React.FC<Props> = ({children}: Props): JSX.Element => {
  return (
    <div className={styles['layout']}>
      <Head>
        <meta name="description" content="Map" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </div>
  )
}

export default Layout