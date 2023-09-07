import { CloseIcon, SimulationSettingIcon } from '@/components/Icons/Icons';
import { useSimulationSettingStore } from '@/providers/RootStoreProvider';
import { SimulationSettingInterface } from '@/stores/SimulationSettingStore';
import { toTitleCase } from '@/utils/format_string_to_title';
import React, { memo, useState } from 'react';
import styles from './_ModalContents.module.scss';

interface Props {
  setToggleModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SettingOptionInterface {
  key: keyof SimulationSettingInterface;
  title: string;
  values: string[] | number[];
}

interface SettingListInterface {
  type: string;
  options: SettingOptionInterface[];
}

const settingOptions1: SettingListInterface[] = [
  {
    type: 'General',
    options: [
      {
        key: 'flashTime',
        title: 'Flash Time (miliseconds)',
        values: [1000, 2000, 3000],
      },
      {
        key: 'fillTime',
        title: 'Fill Time (miliseconds)',
        values: [1000, 2000, 3000, 4000],
      },
      {
        key: 'listShape',
        title: 'List Shape',
        values: ['yes', 'no'],
      },
      {
        key: 'signalTypes',
        title: 'Signal Types',
        values: ['green', 'red'],
      },
      {
        key: 'checkErrorFor',
        title: 'Check Error for',
        values: ['person', 'group'],
      },
      {
        key: 'allShapeBlink',
        title: 'Allow all shape to blink',
        values: ['yes', 'no'],
      },
      {
        key: 'commAndAppMixTogether',
        title: 'Allow signals go to Comm & App Mix together',
        values: ['yes', 'no'],
      },
      {
        key: 'commMixTogether',
        title: 'Allow signals go to Comm Mix together',
        values: ['yes', 'no'],
      },
    ]
  },
  {
    type: 'Signal Travel',
    options: [
      {
        key: 'stTypes',
        title: 'Types',
        values: ['online', 'offline'],
      },
      {
        key: 'stTokenTravelTime',
        title: 'Token Travel Time (miliseconds)',
        values: [2000, 3000, 4000, 5000],
      },
      {
        key: 'stShowSignal',
        title: 'Show Signal on Receiving',
        values: ['yes', 'no'],
      },
    ]
  },
]

const settingOptions: SettingListInterface[] = [
  {
    type: 'General',
    options: [
      {
        key: 'transitionTime',
        title: 'Time for transition (milliseconds)',
        values: [1000, 2000, 3000],
      },
      {
        key: 'discardTime',
        title: 'Time to discard (milliseconds)',
        values: [1000, 2000, 3000, 4000],
      },
      {
        key: 'boundary',
        title: 'Show or hide boundary',
        values: ['Yes', 'No'],
      },
      {
        key: 'effectedFunction',
        title: 'Show effected function',
        values: ['Random', 'Neighborhood'],
      },
    ]
  },
]

const SimulationSettingM: React.FC<Props> = ({setToggleModal}: Props): JSX.Element => {
  const simulationSettingStore = useSimulationSettingStore();
  const [setting, setSetting] = useState<SimulationSettingInterface>(simulationSettingStore);

  const closeModal = (): void => {
    setToggleModal(false);
  }

  const saveLocalSetting = (key: keyof SimulationSettingInterface, value: string | number | boolean) => {
    const localSetting = Object.assign({}, setting, {[key]: value});
    setSetting(localSetting);
  }

  const saveGlobalSetting = () => {
    simulationSettingStore.saveSetting(setting);
    setToggleModal(false);
  }

  return (
    <div className={`${styles['simulation-setting-wrap']}`} onClick={e => e.stopPropagation()}>
      <div className={`${styles['header']}`}>
        <button onClick={closeModal}><CloseIcon /></button>
        <h3>Simulation Setting</h3>
      </div>
      <div className={`${styles['main']}`}>
        <div className={`${styles['main-title']}`}>
          <SimulationSettingIcon />
          <h4>Setting Parameters</h4>
        </div>
        <div className={`${styles['main-content']}`}>
          {settingOptions.map((option, index) => (
            <div key={index} className={`${styles['option-wrap']}`}>
              <h5>{option.type}</h5>
              {option.options.map((item, index) => (
                <div key={index} className={`${styles['option']}`}>
                  <label htmlFor={`option-${item.key}`}>
                    {item.title}
                  </label>
                  <select 
                    name={`option-${item.key}`} 
                    id={`option-${item.key}`} 
                    value={setting[item.key]}
                    onChange={(e) => saveLocalSetting(item.key, e.target.value)}
                  >
                    {item.values.map((value, index) => (
                      <option key={index} value={value}>
                        {toTitleCase(value.toString())}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className={`${styles['footer']}`}>
        <small></small>
        <div className={`${styles['option-btns']}`}>
          <button className='primary-btn' onClick={saveGlobalSetting}>
            OK
          </button>
          <button className='secondary-btn' onClick={closeModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default memo(SimulationSettingM)