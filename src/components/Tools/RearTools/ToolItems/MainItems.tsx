import { useGlobalStore } from "@/providers/RootStoreProvider";
import { ItemInterface } from "@/utils/util_interfaces";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import RearItemName from "./RearItemName";
import styles from "./_ToolItems.module.scss";

interface Props {
  isExpanded: boolean;
  item: ItemInterface;
}

const MainItems: React.FC<Props> = ({ isExpanded, item }: Props): JSX.Element => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const globalStore = useGlobalStore();

  return (
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
      className={`
        ${styles["item-btn"]}
        ${globalStore.addIcon === item.value ? styles["active"] : null}
        ${item.ability ? null : styles["disable"]}
      `}
    >
      <span>
        <item.Icon />
      </span>
      {isExpanded ? <p>{item.name}</p> : isDragging ? <></> : <RearItemName itemName={item.name} />}
    </button>
  );
};

export default observer(MainItems);
