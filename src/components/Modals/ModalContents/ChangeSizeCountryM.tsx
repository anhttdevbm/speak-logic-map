import React, { useState } from 'react';
import styles from './_ModalContents.module.scss';

interface Props {
  setToggleModal: React.Dispatch<React.SetStateAction<boolean>>;
  size?: number[],
}

const ChangeSizeCountryM: React.FC<Props> = ({setToggleModal}: Props): JSX.Element => {
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');

  const closeModal = (): void => {
    setToggleModal(false);
  }

  const handleChangeSize = () => {
    if (Number(width) >= 100 && Number(height) >= 50) {
      // @ts-ignore
      changeSizeCountryFn(width, height);
      setToggleModal(false);
    }
  }

  return (
    <div className={`${styles['change-size-country-wrap']}`} onClick={e => e.stopPropagation()}>
      <div className={`${styles['header']}`}>
        <h3>Enter new size</h3>
      </div>
      <div className={`${styles['content']}`}>
        <div className={`${styles['input']}`}>
          <input type='number' name='width-input' value={width} placeholder='>= 100' onChange={e => setWidth(e.target.value)} />
          <label htmlFor='width-input'>Width</label>
        </div>
        <div className={`${styles['input-cross']}`}>x</div>
        <div className={`${styles['input']}`}>
          <input type='number' name='height-input' value={height} placeholder='>= 50' onChange={e => setHeight(e.target.value)} />
          <label htmlFor='height-input'>Height</label>
        </div>
      </div>
      <div className={`${styles['footer']}`}>
        <button className={`${(Number(width) < 100 || Number(height) < 50) ? styles['disable'] : null}`} type='button' onClick={handleChangeSize}>
          OK
        </button>
        <button type='button' onClick={closeModal}>
          Cancel
        </button>
      </div>
    </div>
  )
}

export default ChangeSizeCountryM