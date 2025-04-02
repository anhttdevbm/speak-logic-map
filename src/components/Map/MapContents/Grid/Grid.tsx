/* eslint-disable react-hooks/exhaustive-deps */
import L from "leaflet";
import { memo, useEffect } from "react";
import { useMap } from "react-leaflet";

const GridLayerCustom = L.GridLayer.extend({
  createTile: function() {
    var tile = L.DomUtil.create('canvas', 'leaflet-tile');
    this.options = {
      tileSize: 64,
      pane: 'tilePane',
      opacity: 0.6,
      zIndex: 10,
    };
    tile.style.border = '1px solid #dddddd';
    return tile
  }
})

export const Grid = new GridLayerCustom();

const GridLayer: React.FC<{showGrid: boolean}> = ({showGrid}): null => {
  const map = useMap();

  useEffect(() => {
    map.flyTo({lat: 20, lng: 20}, map.getZoom());
  }, []);

  useEffect(() => {
    if (showGrid) {
      map.addLayer(Grid);
    }
    else {
      map.removeLayer(Grid);
    }
  }, [showGrid])

  return null;
}

export default memo(GridLayer)