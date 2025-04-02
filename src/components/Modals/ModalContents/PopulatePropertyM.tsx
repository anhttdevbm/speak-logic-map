/* eslint-disable react-hooks/exhaustive-deps */
import { defaultFunction, defaultFunctionPerson, defaultPerson } from '@/components/Map/MapContents/Variables/Variables';
import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import styles from './_ModalContents.module.scss';

interface Props {
  setToggleModal: React.Dispatch<React.SetStateAction<boolean>>;
  setPopulateCountry: React.Dispatch<React.SetStateAction<string>>;
  populateCountry: string;
}

const options: {value: string, name: string}[] = [
  {
    value: 'function',
    name: 'Populate Function',
  },
  {
    value: 'person',
    name: 'Populate Person',
  },
  {
    value: 'function-person',
    name: 'Populate Function & Person',
  },
]

const PopulatePropertyM: React.FC<Props> = ({setToggleModal, populateCountry, setPopulateCountry}: Props): JSX.Element => {
  const defaultRef = useRef({
    defaultFunction: defaultFunction[0],
    defaultPerson: defaultPerson[0],
    defaultFunctionPerson: defaultFunctionPerson[0],
  });

  const [defaultValue, setDefaultValue] = useState<string>(defaultRef.current.defaultFunction);
  const [population, setPopulation] = useState<string>('');
  const [selectedValue, setSelectedValue] = useState<string>('function');

  const handlePopulateFnModal = () => {
    defaultFunction[0] = defaultRef.current.defaultFunction;
    defaultPerson[0] = defaultRef.current.defaultPerson
    defaultFunctionPerson[0] = defaultRef.current.defaultFunctionPerson
    setToggleModal(false);
    setPopulateCountry('');
  };

  const closeModal = () => {
    setToggleModal(false);
    setPopulateCountry('');
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(e.target.value);
  }

  const handleInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDefaultValue(e.target.value);
    if (selectedValue === 'function') {
      defaultRef.current.defaultFunction = e.target.value;

    }
    else if (selectedValue === 'person') {
      defaultRef.current.defaultPerson = e.target.value;
    }
    else if (selectedValue === 'function-person') {
      defaultRef.current.defaultFunctionPerson = e.target.value;
    }
  }

  useEffect(() => {
    if (populateCountry === 'USA') setPopulation('330 Million');
    else if (populateCountry === 'VNM') setPopulation('98 Million');
    else if (populateCountry === 'GBR') setPopulation('67 Million');
    else if (populateCountry === 'BEL') setPopulation('11 Million');
    else if (populateCountry === 'BOL') setPopulation('1.6 Thousand');
  }, [])

  useEffect(() => {
    if (selectedValue === 'function') {
      setDefaultValue(defaultRef.current.defaultFunction);

    }
    else if (selectedValue === 'person') {
      setDefaultValue(defaultRef.current.defaultPerson);
    }
    else if (selectedValue === 'function-person') {
      setDefaultValue(defaultRef.current.defaultFunctionPerson);
    }
  }, [selectedValue])

  return (
    <div className={`${styles['populate-property-wrap']}`} onClick={e => e.stopPropagation()}>
      <div className={`${styles['header']}`}>
        <h3>Property Dialog</h3>
      </div>
      <div className={`${styles['content']}`}>
        <div className={`${styles['option']}`}>
          <h4>Country: {populateCountry}</h4>
        </div>
        <div className={`${styles['option']}`}>
          <h4>Population: {population}</h4>
        </div>
        <div className={`${styles['option']}`}>
          <label htmlFor='display-options'>Display options:</label>
          <select
            name='display-options'
            value={selectedValue}
            onChange={e => handleChange(e)}
          >
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
        <div className={`${styles['option']}`}>
          <label>Population value:</label>
          <span>
            <input 
              type='number' value={defaultValue} min={1} 
              onChange={(e) => handleInputValueChange(e)} 
            />
          </span>
        </div>
      </div>
      <div className={`${styles['footer']}`}>
        <button onClick={() => handlePopulateFnModal()}>OK</button>
        <button onClick={() => closeModal()}>Cancel</button>
      </div>
    </div>
  )
}

export default observer(PopulatePropertyM)