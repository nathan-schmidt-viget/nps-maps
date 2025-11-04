"use client";

import { getLocalNPSbyCode, getSlugFromName } from "../utils/helpers";

interface LocationPopupProps {
  selectedItem: string | null;
}

export default function LocationPopup({ selectedItem }: LocationPopupProps) {
  let mapItem = null;
  if (selectedItem) {
    const item = getLocalNPSbyCode(selectedItem);
    mapItem = item;
  }
  if (!mapItem) {
    return null;
  }

  const slug = getSlugFromName(mapItem.properties.Name);

  return (
    <div className='p-4 bg-white rounded-lg border shadow-sm border-stone-100'>
      <h2 className='mb-3 font-serif text-lg font-semibold leading-tight text-stone-800'>
        {mapItem?.properties?.Name}
      </h2>

      <a
        href={`/park/${slug}`}
        className='inline-block px-4 py-2 text-sm font-medium text-center text-white bg-amber-700 rounded-lg border border-amber-600 transition-colors duration-200 hover:bg-amber-800'
        aria-label={`View details for ${mapItem?.properties?.Name}`}
      >
        View Park Details
      </a>
    </div>
  );
}
