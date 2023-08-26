import { CheckIcon, MenuIcon, SimulationIcon } from '@/components/Icons/Icons';
import SimulationSettingM from '@/components/Modals/ModalContents/SimulationSettingM';
import ModalWrap from '@/components/Modals/ModalWrap';
import { useGlobalStore } from '@/providers/RootStoreProvider';
import { observer } from 'mobx-react-lite';
import React, { memo, useState } from 'react';
import styles from './_ToolItem.module.scss';

const Simulation: React.FC = (): JSX.Element => {
  const [toggleSimulationSettingModal, setToggleSimulationSettingModal] = useState<boolean>(false);
  const globalStore = useGlobalStore();

  return (
    <>
      {toggleSimulationSettingModal && (
        <ModalWrap setToggleModal={setToggleSimulationSettingModal}>
          <SimulationSettingM setToggleModal={setToggleSimulationSettingModal}/>
        </ModalWrap>
      )}
      <button type="button" className={`${styles['left-item-wrap']}`}>
        <SimulationIcon />
        <ul className={`${styles['sub-menu-list']}`}>
          <li onClick={() => globalStore.toggleSimulation()}>
            Simulation
            <CheckIcon className={`${styles['sub-icon']} ${!globalStore.simulation ? styles['hide'] : styles['show']}`}
            />
          </li>
          <li onClick={() => setToggleSimulationSettingModal(true)}>
            Simulation Setting
          </li>
        </ul>
      </button>
    </>
  )
}

export default observer(Simulation)