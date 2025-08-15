import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    // Check if NPS token is available
    if (!process.env.IPDATA_KEY) {
      console.warn("IPData key not found");
      return NextResponse.json(
        { error: "IPData key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.ipdata.co?api-key=${process.env.IPDATA_KEY}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({
      latitude: data.latitude,
      longitude: data.longitude,
    });
  } catch (error) {
    console.error("Error fetching IP data:", error);
    return NextResponse.json(
      { error: "Failed to fetch IP data" },
      { status: 500 }
    );
  }
}
