import React, {useState} from 'react';
import styles from './_ModalContents.module.scss';
import {unitDistance} from "@/components/Map/MapContents/Variables/Variables";

interface Props {
    setToggleModal: any;
}
const ChangeUnitDistanceM: React.FC<Props> = ({setToggleModal}: Props) => {
    const unitOptions = [
        { value: 'km', label: 'Km' },
        { value: 'mile', label: 'Mile' },
    ];
    const [unitValue, setUnitValue] = useState<any>(unitDistance[0]);

    const closeModal = (): void => {
        setToggleModal();
    }

    const handleSetUnitDistance= () => {
        unitDistance[0] = unitValue;
        setToggleModal();
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setUnitValue(e.target.value);
    }

    return (
        <div className={`${styles['rename-wrap']}`} onClick={e => e.stopPropagation()}>
            <div className={`${styles['rename-header']}`}>
                <h3 style={{marginBottom: '10px'}}>Change unit of distance</h3>
            </div>
            <div>
                <select
                    style={{width: '100%'}}
                    name='display-options'
                    value={unitValue}
                    defaultValue={unitDistance[0]}
                    onChange={(e: any) => handleChange(e)}
                >
                    {unitOptions.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className={`${styles['rename-btns']}`}>
                <button type='button' onClick={handleSetUnitDistance}>
                    OK
                </button>
                <button type='button' onClick={closeModal}>
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default ChangeUnitDistanceM
