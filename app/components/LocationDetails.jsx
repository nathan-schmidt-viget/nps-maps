"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";

const LocationDetails = ({
  geoMapItem,
  isLoading,
  locationPopUp,
  setLocationPopUp,
}) => {
  const locationDetailsPopUp = useRef(null);

  // when open changes run open/close command
  useEffect(() => {
    const { current: el } = locationDetailsPopUp;
    if (locationPopUp) el.showModal();
  }, [locationPopUp]);

  const formatPhoneNumber = (phoneNumberString) => {
    var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return "(" + match[1] + ") " + match[2] + "-" + match[3];
    }
    return null;
  };

  return (
    <dialog
      ref={locationDetailsPopUp}
      className='relative mx-auto w-full max-w-6xl rounded-md basis-1/2 bg-zinc-100 backdrop:bg-zinc-900 backdrop:opacity-70'
    >
      {isLoading && <p className='loading'>Loading...</p>}

      <form
        method='dialog'
        className='flex absolute top-1 right-1 z-10 justify-end'
      >
        <button
          className='w-8 h-8 text-white rounded bg-zinc-900 hover:text-zinc-900 hover:bg-white focus:text-zinc-900 focus:bg-white'
          onClick={() => setLocationPopUp(false)}
        >
          <Image src='/close.svg' alt='close' width={16} height={16} />
          <span className='sr-only'>Close</span>
        </button>
      </form>

      {!isLoading &&
        geoMapItem.data.map((location, index) => (
          <div key={index}>
            <div className='flex overflow-x-auto overflow-y-hidden w-full snap-x'>
              {location.images.map((image, index) => (
                <div key={index} className='w-2/3 shrink-0 aspect-video group'>
                  <figure className='relative h-full'>
                    <img
                      src={image.url}
                      alt={image.altText}
                      className='object-cover w-full h-full'
                    />
                    <figcaption className='absolute bottom-0 px-3 py-2 w-full text-white transition-transform duration-300 ease-in-out translate-y-full bg-zinc-900/70 group-hover:translate-y-0'>
                      {image.caption}
                    </figcaption>
                  </figure>
                </div>
              ))}
            </div>
            <div key={location.id} className='grid grid-cols-3 gap-8 px-6 py-8'>
              <div className='md:col-span-2'>
                <h1 className='text-4xl'>{location.fullName}</h1>
                <p className='mt-2 mb-4'>{location.description}</p>

                {location.entranceFees.length > 0 && (
                  <div className='mt-4'>
                    <h2 className='text-xl font-bold text-zinc-900'>
                      Entrance Fees
                    </h2>
                    <div className='grid gap-8 mt-2'>
                      {location.entranceFees.map((fee, index) => (
                        <div key={index}>
                          <h3 className='text-base'>
                            {fee.title} - ${fee.cost}
                          </h3>
                          <p className='mt-1 text-sm'>{fee.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <h2 className='mt-4 text-xl font-bold text-zinc-900'>
                  Weather Info
                </h2>
                <div className='mt-2'>
                  <p>{location.weatherInfo}</p>
                </div>
              </div>

              <aside>
                <h3 className='text-3xl'>Operating Hours</h3>
                <p className='mt-2 text-sm'>
                  {location.operatingHours[0].description}
                </p>
                <ul className='flex flex-col gap-1 mt-4 text-sm'>
                  <li>
                    Sunday - {location.operatingHours[0].standardHours.sunday}
                  </li>
                  <li>
                    Monday - {location.operatingHours[0].standardHours.monday}
                  </li>
                  <li>
                    Tuesday - {location.operatingHours[0].standardHours.tuesday}
                  </li>
                  <li>
                    Wednesday -{" "}
                    {location.operatingHours[0].standardHours.wednesday}
                  </li>
                  <li>
                    Thursday -{" "}
                    {location.operatingHours[0].standardHours.thursday}
                  </li>
                  <li>
                    Friday - {location.operatingHours[0].standardHours.friday}
                  </li>
                  <li>
                    Saturday -{" "}
                    {location.operatingHours[0].standardHours.saturday}
                  </li>
                </ul>
                <h3 className='mt-8 text-xl'>Phone Number(s)</h3>
                <ul className='flex flex-col gap-1 mt-2 text-sm'>
                  {location.contacts.phoneNumbers.map((phone, index) => (
                    <li key={index}>
                      {phone.type}:{" "}
                      <a href={`tel:${phone.phoneNumber}`}>
                        {formatPhoneNumber(phone.phoneNumber)}
                      </a>
                    </li>
                  ))}
                </ul>
                <h3 className='mt-8 text-xl'>Address</h3>
                <p className='text-sm'>
                  {location.addresses[0].line1}
                  <br></br>
                  {location.addresses[0].city},{" "}
                  {location.addresses[0].stateCode}{" "}
                  {location.addresses[0].postalCode}
                </p>
                <a href={location.url} className='mt-2 btn' target='_blank'>
                  View NPS Page
                </a>
              </aside>
            </div>
          </div>
        ))}
    </dialog>
  );
};

export default LocationDetails;
