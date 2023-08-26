import React, { useState } from 'react';
import styles from './_ModalContents.module.scss';

interface Props {
  setToggleModal: React.Dispatch<React.SetStateAction<boolean>>;
  names?: string[],
}

const RenameCountryM: React.FC<Props> = ({setToggleModal, names}): JSX.Element => {
  const [firstName, setFirstName] = useState<string>((names && names.length > 0) ? names[0] : '');
  const [secondName, setSecondName] = useState<string>((names && names.length > 0) ? names[1] : '')
  
  const closeModal = () => {
    setToggleModal(false);
  }

  const handleChangeName = () => {
    // @ts-ignore
    changeNameCountryFn(firstName, secondName);
    setToggleModal(false);
  }

  return (
    <div className={`${styles['rename-wrap']}`} onClick={e => e.stopPropagation()}>
      <div className={`${styles['rename-header']}`}>
        <h3>Enter new name</h3>
      </div>
      <div className={`${styles['rename-input']}`}>
        <label>First line:</label>
        <input type='text' value={firstName} onChange={e => setFirstName(e.target.value)} />
      </div>
      <div className={`${styles['rename-input']}`}>
        <label>Second line:</label>
        <input type='text' value={secondName} onChange={e => setSecondName(e.target.value)} />
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

export default RenameCountryM