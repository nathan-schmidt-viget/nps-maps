"use client";

export default function LocationPopup({ selectedItem, geoMap }) {
  let mapItem = null;
  if (selectedItem) {
    const item = geoMap.find((item) => item.properties.Code === selectedItem);
    mapItem = item;
  }
  return (
    <>
      {mapItem && (
        <div key={mapItem.id} className='mt-3 text-zinc-900'>
          <p className='text-xs font-bold'>{mapItem?.properties?.Name}</p>
          <button
            className='mt-3 text-sm btn'
            onClick={() => console.log(mapItem?.properties?.Code)}
          >
            View
          </button>
        </div>
      )}
    </>
  );
}
