"use client";

import { useEffect, useState } from "react";
import DataSkeleton from "./DataSkeleton";
import { fetchNPSData } from "../utils/npsApi";
import type { EventData, NPSResponse } from "../types";

interface EventsDataProps {
  parkId: string;
}

interface EventsResponse extends NPSResponse {
  data: EventData[];
}

export default function EventsData({ parkId }: EventsDataProps) {
  const [eventsData, setEventsData] = useState<EventsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventsData = async () => {
      if (!parkId) return;

      try {
        setLoading(true);
        setError(null);
        const events = await fetchNPSData("events", 50, parkId);
        setEventsData(events as EventsResponse);
      } catch (err) {
        setError("Failed to load events");
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventsData();
  }, [parkId]);

  if (loading) {
    return <DataSkeleton title='Events' variant='cards' itemCount={4} />;
  }

  if (error) {
    return (
      <div className='p-6 bg-white rounded-lg border border-stone-100'>
        <h2 className='mb-4 font-serif text-2xl text-stone-800'>Events</h2>
        <div className='text-center py-8'>
          <p className='text-stone-600'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='mt-4 px-4 py-2 text-sm bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!eventsData?.data || eventsData.data.length === 0) {
    return (
      <div className='p-6 bg-white rounded-lg border border-stone-100'>
        <h2 className='mb-4 font-serif text-2xl text-stone-800'>Events</h2>
        <div className='text-center py-8'>
          <p className='text-stone-600'>No events scheduled at this time</p>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6 bg-white rounded-lg border border-stone-100'>
      <h2 className='mb-4 font-serif text-2xl text-stone-800'>Events</h2>
      <div className='space-y-4'>
        {eventsData.data.map((event, index) => (
          <div key={index}>
            <h3 className='font-medium text-stone-800'>{event.title}</h3>
            <div
              className='text-stone-600'
              dangerouslySetInnerHTML={{ __html: event.description }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
