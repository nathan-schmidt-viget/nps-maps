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
    "flex bg-white flex-col gap-3 overflow-y-auto text-left p-2 md:max-w-sm h-[50vh] md:h-full",
    showSidebar ? "" : "md:hidden",
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
          className='flex gap-1 items-center px-4 py-2 text-sm bg-white rounded-b-lg -rotate-90 -translate-x-10 text-zinc-900 hover:bg-emerald-800 hover:text-white'
        >
          Locations
          <Image src='/arrow.svg' alt='arrow' width={16} height={16} />
        </button>
      </div>

      <aside className={sideBarClasses.join(" ").trim()}>
        <div className='flex gap-3 items-center'>
          <button
            className='hidden sticky top-0 w-8 h-8 bg-white rounded md:block hover:text-white hover:bg-zinc-900 text-zinc-900 focus:text-white focus:bg-zinc-900'
            onClick={() => toggleSidebar()}
          >
            <Image src='/close.svg' alt='close' width={16} height={16} />
            <span className='sr-only'>Close</span>
          </button>
          <p className='text-xs text-black'>
            Showing {currentTotal} locations within {searchRadius} miles.
          </p>
        </div>
        {geoMap.map((item) => (
          <button
            className={`btn items-center flex-row gap-2 w-full  ${
              (selectedItem == item.properties.Code && "active",
              item.show ? "flex" : "hidden")
            }`}
            key={item.id}
            onClick={(e) => {
              createPopUp(item, e), flyToLocation(map, item);
            }}
          >
            <div className='w-5'>
              <Image src='/map-pin.svg' alt='map-pin' width={16} height={16} />
            </div>
            <span className='flex flex-col text-left'>
              <span className='inline-block text-sm'>
                {item.properties.Name}
              </span>
              {item.properties.distance && (
                <span className='mt-1 text-xs'>
                  {Math.round(item.properties.distance * 100) / 100} miles away
                </span>
              )}
            </span>
          </button>
        ))}
      </aside>
    </div>
  );
};

export default LocationButtons;
