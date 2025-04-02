import React, { useState } from 'react';
import styles from './_ModalContents.module.scss';

interface Props {
  setToggleModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const shortenName = (name: string): string => {
  let trimName = name.trim();
  return trimName.length > 6 ? `${trimName.slice(0, 6)}...` : trimName;
} 

const RenameM: React.FC<Props> = ({setToggleModal}: Props): JSX.Element => {
  const [value, setValue] = useState<string>('');

  const closeModal = (): void => {
    setToggleModal(false);
  }

  const handleChangeName = () => {
    // @ts-ignore
    edittingItem(false, shortenName(value));
    setToggleModal(false);
  }

  return (
    <div className={`${styles['rename-wrap']}`} onClick={e => e.stopPropagation()}>
      <div className={`${styles['rename-header']}`}>
        <h3>Enter new name</h3>
      </div>
      <div className={`${styles['rename-input']}`}>
        <input type='text' value={value} onChange={e => setValue(e.target.value)} />
      </div>
      <div className={`${styles['rename-btns']}`}>
        <button type='button' onClick={handleChangeName}>
          OK
        </button>
        <button type='button' onClick={closeModal}>
          Cancel
        </button>
      </div>
    </div>
  )
}

export default RenameM