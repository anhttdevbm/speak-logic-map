export const addEquation = (map, lat, lng, isLocked) => {
  L.marker([lat, lng], {
    target: { status: "add", type: "equation" },
    // icon: markerHouseIcon(),
    draggable: !isLocked,
  })
    .on("contextmenu", (e) => {
      const housePopup = L.popup().setLatLng([lat, lng]).setContent(housePopupHTML()).addTo(map);

      window.deleteHouse = () => {
        map.removeLayer(e.target);
        map.removeLayer(housePopup);
      };
    })
    .addTo(map);
};

export const checkMarkerExist = (map, index, type, lat, lng) => {
  let existArr = [];
  map.eachLayer((layer) => {
    if (
      layer.options.target?.status === "add" &&
      layer.options.target?.type === type &&
      Number(layer.options.target?.index) === Number(index) &&
      layer._latlng?.lat === lat &&
      layer._latlng?.lng === lng
    ) {
      existArr.push(true);
    } else {
      existArr.push(false);
    }
  });

  return existArr.includes(true);
};

export const addMarkerFn = (
  container,
  lat,
  lng,
  index,
  isLocked,
  setModal,
  setModalType,
  name,
  customIndex,
  customClass,
  setShapeOfMarkerFn,
  addMarkerProblemToList,
  setShapeOfMarkerPl,
  removeMapLayerById,
  updateStatusDisplayMapLayerByNameAndType,
  updateStatusDisplayListMarkerFunctionByName,
  setMapLayer,
  updateNameItemMapLayerByNameAndType,
  updateNameItemListMarkerFunctionByName,
  updateMapLayerById,
  shape
) => {
  let marker = L.marker([lat, lng], {
    target: {
      type: "function",
      shape: shape,
      index: index,
      status: "add",
    },
    icon: markerFnIcon(
      `${shape === "ellipse" ? styles["ellipse-fn"] : shape === "circle" ? styles["circle-fn"] : styles["rectangle-fn"]}
${styles["fn--black"]} ${customClass}`,
      `${name && customIndex ? `${name} ${customIndex[0]}` : name ? `${name}` : `Function ${index}`}`
    ),
    draggable: !isLocked,
  })
    .on("contextmenu", (e) =>
      functionPopup(
        container,
        setModal,
        setModalType,
        isLocked,
        e,
        setShapeOfMarkerFn,
        addMarkerProblemToList,
        setShapeOfMarkerPl,
        removeMapLayerById,
        updateStatusDisplayMapLayerByNameAndType,
        updateStatusDisplayListMarkerFunctionByName,
        setMapLayer,
        updateNameItemMapLayerByNameAndType,
        updateNameItemListMarkerFunctionByName
      )
    )
    .on("click", (e) => addSelectedItem(e, container, isLocked))
    // .on('dblclick', e => toggleBoundaryFn(e))
    .addTo(container);

  marker.on("dragend", function (event) {
    let latLng = event.target._latlng;
    updateMapLayerById(latLng.lat, latLng.lng, "function", `Function ${index}`, false);
  });
};
