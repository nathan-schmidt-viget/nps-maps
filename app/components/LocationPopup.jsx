"use client";

const LocationPopup = ({ geoMapItem, isLoading, setLocationPopUp }) => (
  <>
    {isLoading && <p className='loading'>Loading...</p>}
    {!isLoading &&
      geoMapItem.data.map((park) => (
        <div key={park.id} className='mt-3 text-zinc-900'>
          <p className='text-xs font-bold'>{park.fullName}</p>
          <p className='mt-2 text-xs'>
            {park.addresses[0].line1}
            <br></br>
            {park.addresses[0].city}, {park.addresses[0].stateCode}{" "}
            {park.addresses[0].postalCode}
          </p>
          <button
            className='mt-3 text-sm btn'
            onClick={() => setLocationPopUp(true)}
          >
            View
          </button>
        </div>
      ))}
  </>
);

export default LocationPopup;
