/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import IMG_USER from '@/assets/images/user.jpg';
import styles from './_ToolItem.module.scss';
import Image from 'next/image';
import { observer } from 'mobx-react-lite';
import { useGlobalStore } from '@/providers/RootStoreProvider';
import ModalWrap from '@/components/Modals/ModalWrap';
import DefaultLocationM from '@/components/Modals/ModalContents/DefaultLocationM';
import { getLocation } from '@/utils/get_geolocation';


const User: React.FC = (): JSX.Element => {
  const globalStore = useGlobalStore();
  const [toggleLocationModal, setToggleLocationModal] = useState<boolean>(false);

  return (
    <div className={`${styles['user-wrap']}`}>
      {toggleLocationModal && (
        <ModalWrap setToggleModal={setToggleLocationModal}>
          <DefaultLocationM setToggleModal={setToggleLocationModal}/>
        </ModalWrap>
      )}
      <div className={`${styles['user']}`}>
        <Image src={IMG_USER} alt='user' width={30} height={30} />
        <div className={`${styles['info']}`}>
          <div className={`${styles['avatar']}`}>
            <Image src={IMG_USER} alt='user' width={50} height={50} />
          </div>
          <h3 className={`${styles['name']}`}>Pham Mai Huong</h3>
          <div className={`${styles['profile']}`}>
            <h4>Title:</h4>
            <p>Lorem Ipsum</p>
          </div>
          <div className={`${styles['profile']}`}>
            <h4>Function:</h4>
            <p>Lorem Ipsum</p>
          </div>
          <div className={`${styles['profile']}`}>
            <h4>Default Location:</h4>
            <button type='button' onClick={() => setToggleLocationModal(true)}>
              {globalStore.code}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default observer(User);