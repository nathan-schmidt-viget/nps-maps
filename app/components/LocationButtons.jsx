"use client";

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
          className='flex gap-1 items-center px-6 py-2 text-sm bg-amber-700 rounded-b-lg border transition-colors duration-200 -rotate-90 -translate-x-10 border-stone-50 text-stone-50 hover:bg-amber-900'
        >
          Locations
        </button>
      </div>

      <aside className={sideBarClasses.join(" ").trim()}>
        <div className='flex gap-3 items-center mb-4'>
          <button
            className='hidden sticky top-0 justify-center items-center bg-white transition-colors duration-200 size-8 text-stone-600 hover:text-stone-900 md:flex md:justify-center md:items-center'
            onClick={() => toggleSidebar()}
          >
            <span className='text-2xl'>×</span>
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
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                  <path
                    d='M12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364L12 23.7279ZM16.9497 15.9497C19.6834 13.2161 19.6834 8.78392 16.9497 6.05025C14.2161 3.31658 9.78392 3.31658 7.05025 6.05025C4.31658 8.78392 4.31658 13.2161 7.05025 15.9497L12 20.8995L16.9497 15.9497ZM12 13C10.8954 13 10 12.1046 10 11C10 9.89543 10.8954 9 12 9C13.1046 9 14 9.89543 14 11C14 12.1046 13.1046 13 12 13Z'
                    fill='currentColor'
                  ></path>
                </svg>
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
