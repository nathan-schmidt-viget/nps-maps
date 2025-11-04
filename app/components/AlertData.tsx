"use client";

import { useEffect, useState } from "react";
import DataSkeleton from "./DataSkeleton";
import { fetchNPSData } from "../utils/npsApi";
import type { AlertData as AlertDataType, NPSResponse } from "../types";

interface AlertDataProps {
  parkId: string;
}

type AlertsResponse = NPSResponse<AlertDataType>;

export default function AlertData({ parkId }: AlertDataProps) {
  const [alertData, setAlertData] = useState<AlertsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlertData = async () => {
      if (!parkId) return;

      try {
        setLoading(true);
        setError(null);
        const alerts = await fetchNPSData("alerts", 10, parkId);
        setAlertData(alerts as AlertsResponse);
      } catch (err) {
        setError("Failed to load alerts");
        console.error("Error fetching alerts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlertData();
  }, [parkId]);

  if (loading) {
    return <DataSkeleton title='Alerts' variant='list' itemCount={3} />;
  }

  if (error) {
    return (
      <div className='p-6 bg-white rounded-lg border border-stone-100'>
        <h3 className='mb-4 font-serif text-2xl text-stone-800'>Alerts</h3>
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

  if (!alertData?.data || alertData.data.length === 0) {
    return (
      <div className='p-6 bg-white rounded-lg border border-stone-100'>
        <h3 className='mb-4 font-serif text-2xl text-stone-800'>Alerts</h3>
        <div className='text-center py-8'>
          <p className='text-stone-600'>No alerts at this time</p>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6 bg-white rounded-lg border border-stone-100'>
      <h3 className='mb-4 font-serif text-2xl text-stone-800'>Alerts</h3>
      <div className='space-y-4'>
        {alertData.data.map((alert, index) => (
          <div key={index}>
            <div className='flex flex-col gap-3 items-start mb-2'>
              <div className='flex flex-col items-start mt-0.5 gap-1'>
                <h4 className='font-medium text-stone-800'>{alert.title}</h4>
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
              <div className='text-sm text-stone-600'>{alert.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
