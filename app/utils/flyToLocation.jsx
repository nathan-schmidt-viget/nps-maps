const flyToLocation = (map, currentItem) => {
  map.current.flyTo({
    center: currentItem.geometry.coordinates,
    zoom: 8.5,
    duration: 3000,
    essential: true, // This animation is considered essential with
    //respect to prefers-reduced-motion
  });
}; 

export default flyToLocation;
