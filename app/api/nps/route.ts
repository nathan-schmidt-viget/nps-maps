import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  // Check if NPS token is available
  if (!process.env.NPS_KEY) {
    console.warn("NPS token not available");
    return NextResponse.json(
      { error: "NPS token not configured" },
      { status: 500 }
    );
  }

  try {
    // Fetch all parks data from NPS API
    const response = await fetch(
      `https://developer.nps.gov/api/v1/parks?limit=1000&api_key=${process.env.NPS_KEY}`,
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
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching NPS data:", error);
    return NextResponse.json(
      { error: "Failed to fetch NPS data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { selectedItem } = await request.json();

    // Check if NPS token is available
    if (!process.env.NPS_KEY) {
      console.warn("NPS token not available");
      return NextResponse.json(
        { error: "NPS token not configured" },
        { status: 500 }
      );
    }

    // Fetch specific park data from NPS API
    const response = await fetch(
      `https://developer.nps.gov/api/v1/parks?parkCode=${selectedItem}&limit=1&api_key=${process.env.NPS_KEY}`,
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
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching NPS data:", error);
    return NextResponse.json(
      { error: "Failed to fetch NPS data" },
      { status: 500 }
    );
  }
}
