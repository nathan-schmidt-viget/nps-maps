"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocalNPSbyName, formatPhoneNumber } from "../../utils/helpers";

export default function ParkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const parkId = getLocalNPSbyName(use(params).slug);
  const [parkData, setParkData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getNPS = async (parkId: string) => {
      try {
        const response = await fetch("/api/nps", {
          method: "POST",
          body: JSON.stringify({ selectedItem: parkId }),
        });
        const data = await response.json();
        setParkData(data);
      } catch (error) {
        console.error("Error fetching park data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (parkId) {
      getNPS(parkId);
    }
  }, [parkId]);

  if (!parkId) {
    notFound();
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Link href='/'>Back to Map</Link>
      {parkData?.data.map((location: any, index: any) => (
        <div key={index}>
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

              <div className='grid grid-cols-1 md:grid-cols-3'>
                {location.images.map((image, index) => (
                  <figure key={index} className='flex flex-col'>
                    <img
                      src={image.url}
                      alt={image.altText}
                      className='object-cover w-auto h-full max-h-80'
                    />
                    <figcaption className='px-3 py-2 w-full text-xs text-white bg-zinc-900/70'>
                      {image.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>

              <h2 className='mt-4 text-xl font-bold text-white'>
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
                  Thursday - {location.operatingHours[0].standardHours.thursday}
                </li>
                <li>
                  Friday - {location.operatingHours[0].standardHours.friday}
                </li>
                <li>
                  Saturday - {location.operatingHours[0].standardHours.saturday}
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
                {location.addresses[0].city}, {location.addresses[0].stateCode}{" "}
                {location.addresses[0].postalCode}
              </p>
              <a href={location.url} className='mt-2 btn' target='_blank'>
                View NPS Page
              </a>
            </aside>
          </div>
        </div>
      ))}
    </>
  );
}
