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
  const [alertData, setAlertData] = useState<any>(null);
  const [eventsData, setEventsData] = useState<any>(null);
  const [thingsToDoData, setThingsToDoData] = useState<any>(null);

  const getNPS = async (type: string, limit: number, parkId: string) => {
    try {
      const response = await fetch("/api/nps", {
        method: "POST",
        body: JSON.stringify({
          type: type,
          limit: limit,
          selectedItem: parkId,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching park data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (parkId) {
        const parks = await getNPS("parks", 1, parkId);
        const alerts = await getNPS("alerts", 10, parkId);
        const events = await getNPS("events", 50, parkId);
        const thingsToDo = await getNPS("thingstodo", 4, parkId);

        setParkData(parks);
        setAlertData(alerts);
        setEventsData(events);
        setThingsToDoData(thingsToDo);
      }
    };

    fetchData();
  }, [parkId]);

  if (!parkId) {
    notFound();
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-stone-50'>
        <div className='text-center'>
          <div className='mx-auto mb-4 w-12 h-12 rounded-full border-b-2 border-amber-700 animate-spin'></div>
          <p className='font-serif text-stone-600'>
            Loading park information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-stone-50'>
      {/* Breadcrumb Navigation */}
      <nav className='bg-white border-b border-stone-100'>
        <div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
          <div className='flex items-center py-4 space-x-2'>
            <Link
              href='/'
              className='font-medium text-amber-700 transition-colors duration-200 hover:text-amber-800'
            >
              Map
            </Link>
            <span className='text-stone-400'>/</span>
            <span className='font-medium text-stone-600'>
              {parkData?.data?.[0]?.fullName || "Park"}
            </span>
          </div>
        </div>
      </nav>

      {parkData?.data?.map((location: any, index: any) => (
        <div
          key={index}
          className='px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8'
        >
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
            {/* Main Content */}
            <div className='space-y-8 lg:col-span-2'>
              {/* Park Header */}
              <div className='p-6 bg-white rounded-lg border border-stone-100'>
                <h1 className='mb-4 font-serif text-4xl lg:text-5xl text-stone-800'>
                  {location.fullName}
                </h1>
                <p className='font-sans text-lg leading-relaxed text-stone-600'>
                  {location.description}
                </p>
              </div>

              {/* Things To Do */}
              <div className='p-6 bg-white rounded-lg border border-stone-100'>
                <h2 className='mb-6 font-serif text-2xl text-stone-800'>
                  Things To Do
                </h2>
                <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
                  {thingsToDoData?.data?.map((thing: any, index: number) => (
                    <a
                      href={thing.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      key={index}
                      className='flex flex-col gap-2 items-start mb-2 rounded-lg group text-stone-600 bg-stone-100'
                    >
                      <div className='overflow-hidden w-full rounded-t-lg aspect-video'>
                        <img
                          src={thing.images[0].url}
                          alt={thing.images[0].altText}
                          className='object-cover w-full h-auto'
                        />
                      </div>
                      <div className='flex flex-col gap-1 p-4'>
                        <h3 className='font-medium text-stone-800'>
                          {thing.title}
                        </h3>
                        <p className='text-sm text-stone-600'>
                          {thing.shortDescription}
                        </p>
                        <span className='inline-block mt-auto text-amber-700 underline transition-colors duration-200 group-hover:text-amber-800'>
                          Learn More
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Image Gallery - Masonry Style */}
              <div className='p-6 bg-white rounded-lg border border-stone-100'>
                <h2 className='mb-6 font-serif text-2xl text-stone-800'>
                  Gallery
                </h2>
                <div className='gap-4 space-y-4 columns-1 md:columns-2 lg:columns-3'>
                  {location.images.map(
                    (
                      image: { url: string; altText: string; caption: string },
                      index: number
                    ) => (
                      <figure key={index} className='mb-4 break-inside-avoid'>
                        <img
                          src={image.url}
                          alt={image.altText}
                          className='w-full h-auto rounded-lg border transition-colors duration-300 border-stone-200 hover:border-stone-300'
                        />
                        <figcaption className='px-3 py-2 mt-1 text-sm rounded-md text-stone-600 bg-stone-100'>
                          {image.caption}
                        </figcaption>
                      </figure>
                    )
                  )}
                </div>
              </div>

              {/* Entrance Fees */}
              {location.entranceFees.length > 0 && (
                <div className='p-6 bg-white rounded-lg border border-stone-100'>
                  <h2 className='mb-4 font-serif text-2xl text-stone-800'>
                    Entrance Fees
                  </h2>
                  <div className='space-y-4'>
                    {location.entranceFees.map(
                      (
                        fee: {
                          title: string;
                          cost: string;
                          description: string;
                        },
                        index: number
                      ) => (
                        <div
                          key={index}
                          className='pl-4 border-l-4 border-amber-600'
                        >
                          <h3 className='font-sans text-lg font-semibold text-stone-800'>
                            {fee.title} -{" "}
                            <span className='text-amber-700'>${fee.cost}</span>
                          </h3>
                          <p className='mt-1 text-stone-600'>
                            {fee.description}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Events */}
              <div className='p-6 bg-white rounded-lg border border-stone-100'>
                <h2 className='mb-4 font-serif text-2xl text-stone-800'>
                  Events
                </h2>
                <div className='space-y-4'>
                  {eventsData?.data?.map((event: any, index: number) => (
                    <div key={index}>
                      <h3 className='font-medium text-stone-800'>
                        {event.title}
                      </h3>
                      <div
                        className='text-stone-600'
                        dangerouslySetInnerHTML={{ __html: event.description }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className='space-y-6'>
              {/* Operating Hours */}
              <div className='p-6 bg-white rounded-lg border border-stone-100'>
                <h3 className='mb-4 font-serif text-2xl text-stone-800'>
                  Operating Hours
                </h3>
                <p className='mb-4 text-sm text-stone-600'>
                  {location.operatingHours[0].description}
                </p>
                <div className='space-y-2'>
                  {Object.entries(location.operatingHours[0].standardHours).map(
                    ([day, hours]) => (
                      <div
                        key={day}
                        className='flex justify-between items-center py-1 border-b border-stone-100 last:border-b-0'
                      >
                        <span className='text-sm font-medium capitalize text-stone-700'>
                          {day}
                        </span>
                        <span className='text-sm text-stone-600'>
                          {hours as string}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Alerts */}
              {alertData?.data.length > 0 && (
                <div className='p-6 bg-white rounded-lg border border-stone-100'>
                  <h3 className='mb-4 font-serif text-2xl text-stone-800'>
                    Alerts
                  </h3>
                  <div className='space-y-4'>
                    {alertData?.data.map((alert: any, index: number) => (
                      <div key={index}>
                        <div className='flex flex-col gap-3 items-start mb-2'>
                          <div className='flex flex-col items-start mt-0.5 gap-1'>
                            <h4 className='font-medium text-stone-800'>
                              {alert.title}
                            </h4>
                            <span
                              className={`inline-block px-2 py-1 mt-1 text-xs font-medium rounded ${
                                alert.category === "Danger" ||
                                alert.category === "Park Closure"
                                  ? "bg-red-600 text-white"
                                  : alert.category === "Caution"
                                  ? "bg-yellow-600 text-white"
                                  : alert.category === "Information"
                                  ? "bg-blue-600 text-white"
                                  : "bg-amber-600 text-white"
                              }`}
                            >
                              {alert.category}
                            </span>
                          </div>
                          <div className='text-sm text-stone-600'>
                            {alert.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Weather Info */}
              <div className='p-6 bg-white rounded-lg border border-stone-100'>
                <h3 className='mb-4 font-serif text-2xl text-stone-800'>
                  Weather Information
                </h3>
                <p className='leading-relaxed text-stone-700'>
                  {location.weatherInfo}
                </p>
              </div>

              {/* Contact Information */}
              <div className='p-6 bg-white rounded-lg border border-stone-100'>
                <h3 className='mb-4 font-serif text-2xl text-stone-800'>
                  Contact Information
                </h3>

                {/* Phone Numbers */}
                <div className='mb-6'>
                  <h4 className='mb-3 font-sans text-lg font-semibold text-stone-700'>
                    Phone Numbers
                  </h4>
                  <div className='space-y-2'>
                    {location.contacts.phoneNumbers.map(
                      (
                        phone: { type: string; phoneNumber: string },
                        index: number
                      ) => (
                        <div key={index} className='text-sm'>
                          <span className='font-medium text-stone-600'>
                            {phone.type}:
                          </span>
                          <br />
                          <a
                            href={`tel:${phone.phoneNumber}`}
                            className='text-amber-700 underline transition-colors duration-200 hover:text-amber-800'
                          >
                            {formatPhoneNumber(phone.phoneNumber)}
                          </a>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className='mb-6'>
                  <h4 className='mb-3 font-sans text-lg font-semibold text-stone-700'>
                    Address
                  </h4>
                  <address className='text-sm not-italic text-stone-600'>
                    {location.addresses[0].line1}
                    <br />
                    {location.addresses[0].city},{" "}
                    {location.addresses[0].stateCode}{" "}
                    {location.addresses[0].postalCode}
                  </address>
                </div>

                {/* NPS Website Link */}
                <a
                  href={location.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-block px-4 py-3 w-full font-medium text-center text-white bg-amber-700 rounded-lg border border-amber-600 transition-colors duration-200 hover:bg-amber-800'
                >
                  Visit Official NPS Page
                </a>
              </div>
            </aside>
          </div>
        </div>
      ))}
    </div>
  );
}
