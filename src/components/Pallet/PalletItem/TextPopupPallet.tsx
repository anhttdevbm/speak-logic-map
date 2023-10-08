import {Marker, Popup} from "react-leaflet";
import {observer} from "mobx-react-lite";

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
