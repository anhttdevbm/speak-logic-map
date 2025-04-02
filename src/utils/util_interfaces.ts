import { Dispatch, SetStateAction } from "react";

export interface IconProps {
  className? : string;
  onClick?: Dispatch<SetStateAction<boolean>>;
}

export interface ItemInterface {
  value: string;
  Icon: React.NamedExoticComponent<IconProps>;
  name: string;
  ability: boolean;
}