import {useGlobalStore} from '@/providers/RootStoreProvider';
import {ItemInterface} from '@/utils/util_interfaces';
import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import RearItemName from './RearItemName';
import styles from './_ToolItems.module.scss';
import {CheckIcon, RightArrowIcon} from "@/components/Icons/Icons";
import styled, {css} from "styled-components";
import {CheckOutlined} from "@ant-design/icons";

interface Props {
    isExpanded: boolean,
    item: ItemInterface,
}

const MainItems: React.FC<Props> = ({isExpanded, item}: Props): JSX.Element => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const globalStore = useGlobalStore();
    const [clicked, setClicked] = useState(false);
    const [points, setPoints] = useState({
        x: 0,
        y: 0,
    });
    useEffect(() => {
        const handleClick = () => setClicked(false);
        window.addEventListener("click", handleClick);
        return () => {
            window.removeEventListener("click", handleClick);
        };
    }, []);

    return (<>
            <button
                draggable={!globalStore.click}
                onClick={() => {
                    globalStore.click && globalStore.addIconHandle(item.value);
                }}
                onDragStart={() => {
                    if (!globalStore.click) {
                        globalStore.addIconHandle(item.value);
                        setIsDragging(true);
                    }
                }}
                onDragEnd={() => {
                    if (!globalStore.click) {
                        setIsDragging(false);
                    }
                }}
                onContextMenu={(e) => {
                    e.preventDefault();
                    setClicked(true);
                    setPoints({
                        x: e.pageX,
                        y: e.pageY,
                    });
                }}
                contextMenu={'test'}
                className={`
        ${styles['item-btn']} 
        ${globalStore.addIcon === item.value ? styles['active'] : null}
        ${item.ability ? null : styles['disable']}
      `}
            >
      <span>
        <item.Icon/>
      </span>
                {isExpanded
                    ? (
                        <p>{item.name}</p>
                    )
                    : (isDragging
                            ? <></>
                            : (
                                <RearItemName itemName={item.name}/>
                            )
                    )
                }
                {/*{item.value === 'mobility' && <button*/}
                {/*    type='button'*/}
                {/*    className={`${styles['mobility-btn']}`}*/}
                {/*    style={{float: "right"}}*/}
                {/*>*/}
                {/*    <RightArrowIcon/>*/}
                {/*</button>*/}
                {/*}*/}
            </button>
            {item.value === 'mobility' && clicked &&
                <ContextMenu>
                    <ul className={`${styles['minor-list']}`}>
                        <li
                            onClick={() => globalStore.setTypeMobility('path')}
                        >
                            Show Move With Path
                            {globalStore.typeMobility === 'path' &&
                                <CheckOutlined style={{float: "right"}} rev={undefined}/>}
                        </li>
                        <li onClick={() => globalStore.setTypeMobility('no-path')}>
                            Show Move Without Path
                            {globalStore.typeMobility === 'no-path' &&
                                <CheckOutlined style={{float: "right"}} rev={undefined}/>}
                        </li>
                        <li
                            onClick={() => globalStore.setTypeMobility('path-given-set')}
                        >
                            Show Move With Path With The Given Set
                            {globalStore.typeMobility === 'path-given-set' &&
                                <CheckOutlined style={{float: "right"}} rev={undefined}/>}
                        </li>
                        <li onClick={() => globalStore.setTypeMobility('path-no-given-set')}>
                            Show Move Without Path With The Given Set
                            {globalStore.typeMobility === 'path-no-given-set' &&
                                <CheckOutlined style={{float: "right"}} rev={undefined}/>}
                        </li>
                    </ul>
                </ContextMenu>
            }
        </>
    )
}

const ContextMenu = styled.div`
  position: absolute;
  width: 420px;
  background-color: white;
  border-radius: 3px;
  box-sizing: border-box;
  bottom: 0;
  left: 100%;

  ul {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  ul li {
    padding: 1rem 2rem;
    border-bottom: 1px solid #d1d1d1;
  }

  /* hover */

  ul li:hover {
    cursor: pointer;
    background-color: #d1d1d1;
  }
`;

export default observer(MainItems)
