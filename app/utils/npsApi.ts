/**
 * Fetches data from the NPS API
 * @param type - The type of data to fetch (e.g., 'parks', 'alerts', 'events', 'thingstodo')
 * @param limit - Maximum number of results to return
 * @param parkId - The park code to filter by
 * @returns Promise with the API response data
 */
export async function fetchNPSData(
  type: string,
  limit: number,
  parkId: string
) {
  const response = await fetch("/api/nps", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: type,
      limit: limit,
      selectedItem: parkId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch NPS data: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
