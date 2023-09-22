import { useGlobalStore } from '@/providers/RootStoreProvider';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { MapContainer, TileLayer } from "react-leaflet";

const WorldMode = () => {
  const globalStore = useGlobalStore();
  const map = useMap();

  map.eachLayer(layer => {
    if (layer._container?.classList.contains('leaflet-popup')) {
      map.removeLayer(layer);
    }
    if (layer.options.target?.type === 'country-function') {
      map.removeLayer(layer);
    }
  });

  return (
    <TileLayer
      zIndex={0}
      noWrap={true}
      attribution="Mile-2-23112022"
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
  )
}

export default observer(WorldMode)