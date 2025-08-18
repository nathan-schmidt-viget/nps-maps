import geoJson from "../assets/nps.json";
import * as turf from "@turf/turf";

export function getLocalNPSbyCode(selectedItem: string) {
  const item = geoJson.features.find(
    (item) => item.properties.Code === selectedItem
  );
  return item;
}

export function getLocalNPSbyName(selectedItem: string) {
  const item = geoJson.features.find(
    (item) =>
      item.properties.Name.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") === selectedItem.toLowerCase()
  );
  return item?.properties.Code;
}

export function formatPhoneNumber(phoneNumberString: string) {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return null;
}

export function sortItems(
  searchResult: { coordinates: number[] },
  showPopup = true,
  searchRadius = "350"
) {
  const sortedGeoMap = [...geoJson.features];
  const options = { units: "miles" as const };
  //add the distance to the array
  sortedGeoMap.forEach((item: any) => {
    item.properties.distance = turf.distance(
      searchResult.coordinates,
      item.geometry.coordinates,
      options
    );
    item.show = item.properties.distance > searchRadius ? false : true;
  });

  //sort the array by the distance
  sortedGeoMap.sort((a: any, b: any) => {
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
}

export function flyToLocation(map: any, currentItem: any) {
  map.current.flyTo({
    center: currentItem.geometry.coordinates,
    zoom: 8.5,
    duration: 3000,
    essential: true, // This animation is considered essential with
    //respect to prefers-reduced-motion
  });
}
