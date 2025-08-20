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
    <div className='mt-3 text-zinc-900'>
      <p className='text-xs font-bold'>{mapItem?.properties?.Name}</p>

      <a
        href={`/park/${mapItem?.properties?.Name?.toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")}`}
        className='mt-3 text-sm btn'
      >
        View
      </a>
    </div>
  );
}
