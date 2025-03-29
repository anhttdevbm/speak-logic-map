import React from "react";
import styles from "./_TopTools.module.scss";
import { useGlobalStore } from "@/providers/RootStoreProvider";
import Menu from "./ToolItems/Menu";
import Logo from "./ToolItems/Logo";
import HouseView from "./ToolItems/HouseView";
import RoomView from "./ToolItems/RoomView";
import FloorPlanView from "./ToolItems/FloorPlanView";
import BoatView from "./ToolItems/BoatView";
import RectangularView from "./ToolItems/RectangularView";
import MapView from "./ToolItems/MapView";
import TableView from "./ToolItems/TableView";
import Simulation from "./ToolItems/Simulation";
import Options from "./ToolItems/Options";
import Search from "./ToolItems/Search";
import SwitchOptions from "./ToolItems/SwitchOptions";
import User from "./ToolItems/User";
import { observer } from "mobx-react-lite";
import Equation from "./ToolItems/Equation";

const TopTools: React.FC = (): JSX.Element => {
  const globalStore = useGlobalStore();
  return (
    <section className={`${styles["top-tools-wrap"]}`}>
      <div className={`${styles["top-tools-content"]}`}>
        <div className={`${styles["content"]} ${styles["left-content"]}`}>
          <Logo />
          <Menu />
          <HouseView />
          <RoomView />
          <FloorPlanView />
          <BoatView />
          <RectangularView />
          <MapView />
          <TableView />
          <Simulation />
          <Options />
          <Equation />
        </div>
        <div className={`${styles["content"]} ${styles["middle-content"]}`}>{!globalStore.map && <Search />}</div>
        <div className={`${styles["content"]} ${styles["right-content"]}`}>
          <SwitchOptions />
          <User />
        </div>
      </div>
    </section>
  );
};

export default observer(TopTools);
