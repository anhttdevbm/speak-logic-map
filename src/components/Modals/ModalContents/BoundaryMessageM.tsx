import React from 'react';
import styles from './_ModalContents.module.scss';

interface Props {
  type: string,
  setToggleModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const messages: {type: string, title: string, message: string}[] = [
  {
    type: 'natural',
    title: 'MessageFunctionBoundaryNaturalFunction',
    message: 'Natural functions are functions that execute in their own mode and we don’t derive them.  Because of that, we can say that we don’t know the boundary of natural functions.  The way to look at it, since nonnatural functions are considered functions that we add to life, we understand them better than natural functions. Therefore, we can say that we don’t know the boundary of natural functions.'
  },
  {
    type: 'problem',
    title: 'MessageFunctionBoundary',
    message: 'By using The Given Set, we get ideas to derive or add functions to life.  Those functions are considered to be positive added functions of life.  By understand The Given Set and use it to get ideas to execute functions of life, we can say that in relationship with those ideas, those function have boundaries.  What is important here, if the function is negative, it is viewed or acted as a function with no boundary. Therefore, a negative function has not boundary.'
  }
]

const BoundaryMessageM: React.FC<Props> = ({type, setToggleModal}: Props) => {
  const closeModal = () => {
    setToggleModal(false)
  }

  return (
    <>
      {messages.map((mes, index) => mes.type === type && (
        <div key={index} className={`${styles['boundary-message-wrap']}`} onClick={e => e.stopPropagation()}>
        <div className={`${styles['header']}`}>
          <h3>{mes.title}</h3>
        </div>
        <div className={`${styles['content']}`}>
          <p>{mes.message}</p>
        </div>
        <div className={`${styles['footer']}`}>
          <div></div>
          <button type='button' onClick={closeModal}>
            OK
          </button>
        </div>
      </div>
      ))}
    </>
  )
}

export default BoundaryMessageM