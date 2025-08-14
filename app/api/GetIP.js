import axios from "axios";

export default async function GetIP(setLng, setLat) {
  if (!process.env.IPDATA_KEY) {
    console.error("IPData key not found");
    return;
  }

  if (!setLng || !setLat) {
    console.warn("setLng or setLat not found");
    return;
  }

  const fetchIP = async () => {
    try {
      const { data } = await axios.get(
        `https://api.ipdata.co?api-key=${process.env.IPDATA_KEY}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      return data;
    } catch (err) {
      console.log(err.message);
    }
  };

  fetchIP();
}
