import {markerNavigationSignIcon, markerPersonIcon} from "@/components/Map/MapContents/Markers/MarkerIcons";
import {Marker, Popup} from "react-leaflet";
import {observer} from "mobx-react-lite";
import {CountryName} from "@/pages/api/countries";

const ScrollFeatureView = ({position}: any) => {
    const click = () => {
        console.log('CLICK');
    }
    return(
        <Marker position={position}>
            <Popup>
                <div style={{ fontSize: "24px", color: "black" }}>
                    <p>A pretty React Popup</p>
                    <button onClick={click}>ADD</button>
                </div>
            </Popup>
        </Marker>
    )
}

export default observer(ScrollFeatureView);