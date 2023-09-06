import {Marker, Popup} from "react-leaflet";
import {observer} from "mobx-react-lite";
import RectHouse from "@/components/Map/MapContents/Views/rect/RectHouse";

const TextPopupPallet = ({position}: any) => {
    return(
        <Marker position={position}>
            <Popup>
                <textarea rows={4} cols={50}/>
            </Popup>
        </Marker>
    )
}

export default observer(TextPopupPallet);