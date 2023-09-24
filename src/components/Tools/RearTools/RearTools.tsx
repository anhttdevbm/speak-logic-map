import {
  CircleIcon,
  HomeIcon,
  LeftArrowIcon,
  LocationIcon,
  MainsetIcon,
  PersonIcon,
  RectangleIcon,
  RelatedIcon,
  RightArrowIcon,
  ScrollFeatureIcon,
  VectorIcon,
  WelcomeSignIcon
} from '@/components/Icons/Icons';
import { useGlobalStore } from '@/providers/RootStoreProvider';
import { ItemInterface } from '@/utils/util_interfaces';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import MainItems from './ToolItems/MainItems';
import SwitchOptions from './ToolItems/SwitchOptions';
import styles from './_RearTools.module.scss';


const ItemList: ItemInterface[] = [
  {value: 'function', Icon: RectangleIcon, name: 'Function', ability: true},
  {value: 'person', Icon: PersonIcon, name: 'Person', ability: true},
  {value: 'main-set', Icon: MainsetIcon, name: 'The Given Set', ability: false},
  {value: 'house', Icon: HomeIcon, name: 'House', ability: true},
  {value: 'inter-route', Icon: VectorIcon, name: 'Inter-route', ability: true},
  {value: 'distance', Icon: LocationIcon, name: 'Distance', ability: true},
  {value: 'philosophy', Icon: CircleIcon, name: 'Philosophy', ability: false},
  {value: 'welcome-sign', Icon: WelcomeSignIcon, name: 'Welcome', ability: true},
  // {value: 'horizontal-line', Icon: VectorIcon, name: 'Horizontal Line', ability: true},
  {value: 'scroll-feature', Icon: ScrollFeatureIcon, name: 'Scroll feature', ability: true},
  {value: 'relate', Icon: RelatedIcon, name: 'Relate', ability: true},
  {value: 'mobility', Icon: VectorIcon, name: 'Mobility', ability: true},

]

const RearTools: React.FC = (): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const globalStore = useGlobalStore();
  return (
    <div className={`${styles['rear-tools-wrap']} ${isExpanded ? styles['expanded'] : styles['minimal']}`}>
      <div className={`${styles['rear-tools-content']}`}>
        <div className={`${styles['optional-tools']}`}>
          <div className={`${styles['expand-tools']}`}>
            {isExpanded && (
              <SwitchOptions isExpanded={isExpanded}/>
            )}
          </div>
          <button 
            type='button' 
            className={`${styles['expand-btn']}`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <LeftArrowIcon /> : <RightArrowIcon />}
          </button>
        </div>
        <div className={`${styles['main-tools']}`}>
          {ItemList.map((item, index) => (
            <MainItems key={index} isExpanded={isExpanded} item={item}/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default observer(RearTools)
