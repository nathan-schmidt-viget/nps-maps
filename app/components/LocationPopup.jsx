"use client";

import { getLocalNPSbyCode } from "../utils/helpers";

export default function LocationPopup({ selectedItem }) {
  let mapItem = null;
  if (selectedItem) {
    const item = getLocalNPSbyCode(selectedItem);
    mapItem = item;
  }
  if (!mapItem) {
    return null;
  }

  return (
    <div className='p-4 bg-white rounded-lg border shadow-sm border-stone-100'>
      <h3 className='mb-3 font-serif text-lg font-semibold leading-tight text-stone-800'>
        {mapItem?.properties?.Name}
      </h3>

      <a
        href={`/park/${mapItem?.properties?.Name?.toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")}`}
        className='inline-block px-4 py-2 text-sm font-medium text-center text-white bg-amber-700 rounded-lg border border-amber-600 transition-colors duration-200 hover:bg-amber-800'
      >
        View Park Details
      </a>
    </div>
  );
}
