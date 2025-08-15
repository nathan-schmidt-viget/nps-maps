import geoJson from "../assets/nps.json";
import * as turf from "@turf/turf";

export function getLocalNPSbyCode(selectedItem) {
  const item = geoJson.features.find(
    (item) => item.properties.Code === selectedItem
  );
  return item;
}

export function getLocalNPSbyName(selectedItem) {
  const item = geoJson.features.find(
    (item) =>
      item.properties.Name.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") === selectedItem.toLowerCase()
  );
  return item.properties.Code;
}

export function formatPhoneNumber(phoneNumberString) {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return null;
}

export function sortItems(searchResult, showPopup = true) {
  const sortedGeoMap = [...geoJson.features];
  const options = { units: "miles" };
  //add the distance to the array
  sortedGeoMap.forEach((item) => {
    item.properties.distance = turf.distance(
      searchResult.coordinates,
      item.geometry.coordinates,
      options
    );
    item.show = item.properties.distance > searchRadius ? false : true;
  });

  //sort the array by the distance
  sortedGeoMap.sort((a, b) => {
    if (a.properties.distance > b.properties.distance) {
      return 1;
    }
    if (a.properties.distance < b.properties.distance) {
      return -1;
    }
    return 0; // a must be equal to b
  });

  //set the sorted array to the geoMap
  return sortedGeoMap;

  // //fit map zoom to the search location and closest location - https://turfjs.org/docs/#bbox
  // if (showPopup) {
  //   map.current.fitBounds(
  //     turf.bbox(
  //       turf.lineString([
  //         sortedGeoMap[0].geometry.coordinates,
  //         searchResult.coordinates,
  //       ])
  //     ),
  //     { padding: 100 }
  //   );

  //   // //open popup box for the closest location
  //   createPopUp(sortedGeoMap[0]);
  // }
}
