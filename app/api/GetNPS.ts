import axios from "axios";

export default async function GetNPS(selectedItem, setGeoMapItem, setIsLoading) {
  if (!process.env.NPS_KEY) {
    console.error("NPS key not found");
    return;
  }

  if (!selectedItem || !setGeoMapItem || !setIsLoading) {
    console.warn("selectedItem, setGeoMapItem, or setIsLoading not found");
    return;
  }

  const fetchMapItemData = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `https://developer.nps.gov/api/v1/parks?parkCode=${selectedItem}&limit=1&api_key=${process.env.NPS_KEY}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      setGeoMapItem(data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  fetchMapItemData();
}
