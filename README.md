# National Parks Map

This is a simple demo to explore and test out Map Box using National Park Services Data. [View Map](https://nps-maps.vercel.app/)

There are several things in this demo that I would suggest changing if you are going to use it for production.

- Only pull in the turf.js [individual packages](https://github.com/Turfjs/turf#in-nodejs) that are needed.
- Make the MapBox style be a local JSON file vs.the url. We are using the url for this demo as it is easy to update things in [mapbox studio](https://studio.mapbox.com/) and see the changes instantly. Using JSON file keeps the map styled even if the MapBox server is not responding.

## Local Install

In order to run this locally you will need your own MapBox and NPS keys:

- [MapBox Account](https://account.mapbox.com/auth/signup/)
- [NPS Developer API](https://www.nps.gov/subjects/developer/get-started.htm)
  Once you have both the keys you will need to create a copy of the `.env.template` file by running `cp env.template .env`. Then add your keys to the `.env` file.

Then run:

```
npm install
npm run dev
```

## MapBox

This is based off of two tutorials from MapBox:

- [Store Locator](https://docs.mapbox.com/help/tutorials/building-a-store-locator/)
- [Sort Stores](https://docs.mapbox.com/help/tutorials/geocode-and-sort-stores/)

MapBox Options that are pulled in:

- [MapboxGeocoder](https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-geocoder/)
- [NavigationControl](https://docs.mapbox.com/mapbox-gl-js/example/navigation/)
- [GeolocateControl](https://docs.mapbox.com/mapbox-gl-js/example/locate-user/)

## Turf.js

[Turf.js](https://turfjs.org/) is used to calculate the distance between `MapboxGeocoder` and `GeolocateControl` and the closest location.
Turf is also used to create the bounding box (lat and long) around searched location and nearest location keeping the two location in the map view area.
