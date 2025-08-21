"use client";

import { useEffect, useState } from "react";
import DataSkeleton from "./DataSkeleton";
import Image from "next/image";

export default function ThingsToDoData({ parkId }) {
  const [thingsToDoData, setThingsToDoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getNPS = async (type, limit, parkId) => {
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
      console.error("Error fetching things to do data:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchThingsToDoData = async () => {
      if (!parkId) return;

      try {
        setLoading(true);
        setError(null);
        const thingsToDo = await getNPS("thingstodo", 4, parkId);
        setThingsToDoData(thingsToDo);
      } catch (err) {
        setError("Failed to load things to do");
        console.error("Error fetching things to do:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchThingsToDoData();
  }, [parkId]);

  if (loading) {
    return <DataSkeleton title='Things To Do' variant='grid' itemCount={4} />;
  }

  if (error) {
    return (
      <div className='p-6 bg-white rounded-lg border border-stone-100'>
        <h2 className='mb-6 font-serif text-2xl text-stone-800'>
          Things To Do
        </h2>
        <div className='py-8 text-center'>
          <p className='text-stone-600'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 mt-4 text-sm text-white bg-amber-700 rounded-lg transition-colors hover:bg-amber-800'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!thingsToDoData?.data || thingsToDoData.data.length === 0) {
    return (
      <div className='p-6 bg-white rounded-lg border border-stone-100'>
        <h2 className='mb-6 font-serif text-2xl text-stone-800'>
          Things To Do
        </h2>
        <div className='py-8 text-center'>
          <p className='text-stone-600'>No activities available at this time</p>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6 bg-white rounded-lg border border-stone-100'>
      <h2 className='mb-6 font-serif text-2xl text-stone-800'>Things To Do</h2>
      <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
        {thingsToDoData.data.map((thing, index) => (
          <a
            href={thing.url}
            target='_blank'
            rel='noopener noreferrer'
            key={index}
            className='flex flex-col gap-2 items-start mb-2 rounded-lg group text-stone-600 bg-stone-100'
          >
            <div className='overflow-hidden w-full rounded-t-lg aspect-video'>
              <Image
                src={thing.images[0].url}
                alt={thing.images[0].altText}
                className='object-cover w-full h-auto'
                width={370}
                height={278}
              />
            </div>
            <div className='flex flex-col gap-1 p-4'>
              <h3 className='font-medium text-stone-800'>{thing.title}</h3>
              <p className='text-sm text-stone-600'>{thing.shortDescription}</p>
              <span className='inline-block mt-auto text-amber-700 underline transition-colors duration-200 group-hover:text-amber-800'>
                Learn More
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
