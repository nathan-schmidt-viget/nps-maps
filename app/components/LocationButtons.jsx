"use client";

import Image from "next/image";

const LocationButtons = ({
  map,
  geoMap,
  selectedItem,
  createPopUp,
  flyToLocation,
  showSidebar,
  setShowSidebar,
  searchRadius,
}) => {
  const sideBarClasses = [
    "flex bg-white flex-col gap-3 overflow-y-auto text-left p-6 border border-stone-100 rounded-lg",
    showSidebar ? "" : "md:hidden",
    "md:max-w-sm h-[50vh] md:h-full",
  ];

  //get the length of the locations set to show
  const currentTotal = geoMap.filter(function (item) {
    if (item.show) {
      return true;
    } else {
      return false;
    }
  }).length;

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className='relative order-last w-full md:order-first md:w-auto'>
      <div className='hidden md:flex absolute inset-y-0 right-0 z-[1] translate-x-full items-center'>
        <button
          onClick={() => toggleSidebar()}
          className='flex gap-1 items-center px-4 py-2 text-sm bg-white rounded-b-lg border transition-colors duration-200 -rotate-90 -translate-x-10 border-stone-100 text-stone-700 hover:bg-amber-700 hover:text-white'
        >
          <span className='font-medium'>Locations</span>
          <Image src='/arrow.svg' alt='arrow' width={16} height={16} />
        </button>
      </div>

      <aside className={sideBarClasses.join(" ").trim()}>
        <div className='flex gap-3 items-center mb-4'>
          <button
            className='hidden sticky top-0 justify-center items-center w-8 h-8 bg-white rounded border transition-colors duration-200 border-stone-200 hover:bg-stone-50 text-stone-600 hover:text-stone-800 md:flex'
            onClick={() => toggleSidebar()}
          >
            <Image src='/close.svg' alt='close' width={16} height={16} />
            <span className='sr-only'>Close</span>
          </button>
          <p className='font-sans text-sm text-stone-600'>
            Showing{" "}
            <span className='font-semibold text-stone-800'>{currentTotal}</span>{" "}
            locations within{" "}
            <span className='font-semibold text-stone-800'>{searchRadius}</span>{" "}
            miles.
          </p>
        </div>
        <div className='space-y-2'>
          {geoMap.map((item) => (
            <button
              className={`w-full p-3 text-left rounded-lg border transition-colors duration-200 ${
                selectedItem == item.properties.Code
                  ? "bg-amber-50 border-amber-200 text-amber-800"
                  : "bg-white border-stone-100 text-stone-700 hover:bg-stone-50 hover:border-stone-200"
              } ${item.show ? "flex items-center gap-3" : "hidden"}`}
              key={item.id}
              onClick={(e) => {
                createPopUp(item, e), flyToLocation(map, item);
              }}
            >
              <div className='flex-shrink-0 w-5 text-amber-700'>
                <Image
                  src='/map-pin.svg'
                  alt='map-pin'
                  width={16}
                  height={16}
                />
              </div>
              <div className='flex flex-col min-w-0 text-left'>
                <span className='text-sm font-medium truncate'>
                  {item.properties.Name}
                </span>
                {item.properties.distance && (
                  <span className='mt-1 text-xs text-stone-500'>
                    {Math.round(item.properties.distance * 100) / 100} miles
                    away
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default LocationButtons;
