import React, { memo } from 'react'
import Switch from 'react-switch'
import styles from './_SwitchComp.module.scss';

interface Props {
  className?: string;
  handleOnChange: () => void;
  checked: boolean;
  title: {on: string; off: string};
}

const SwitchComp: React.FC<Props> = ({className, title, checked, handleOnChange}: Props): JSX.Element => { 
  return (
    <Switch 
      checkedIcon={
        <div className={`${styles['switch']} ${styles['switch-on']}`}>
          {title.on}
        </div>
      }
      uncheckedIcon={
        <div className={`${styles['switch']} ${styles['switch-off']}`}>
          {title.off}
        </div>
      }
      className={className}
      width={100}
      checked={checked}
      onColor='#3D3D3D'
      offColor='#ff0000'
      onChange={handleOnChange}
    />
  )
}

export default SwitchComp