"use client";

import React, { useRef, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import * as turf from "@turf/turf";
import geoJson from "../assets/nps.json";
import LocationPopup from "./LocationPopup";
import {
  sortItems,
  flyToLocation,
  getSlugFromName,
  getLocalNPSbyName,
  getLocalNPSbyCode,
} from "../utils/helpers";
import { MAP_DEFAULTS } from "../utils/constants";
import type { NPSFeature, SearchResult } from "../types";

// Validate Mapbox access token
if (!process.env.NEXT_PUBLIC_MAP_BOX_KEY) {
  throw new Error("NEXT_PUBLIC_MAP_BOX_KEY is required");
}
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAP_BOX_KEY;

const Map = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const zoom = MAP_DEFAULTS.ZOOM;
  const pitch = MAP_DEFAULTS.PITCH;
  const searchRadius = MAP_DEFAULTS.SEARCH_RADIUS;
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popUpElement = useRef<HTMLDivElement>(null);
  const [lng, setLng] = useState(MAP_DEFAULTS.DEFAULT_CENTER[0]);
  const [lat, setLat] = useState(MAP_DEFAULTS.DEFAULT_CENTER[1]);
  const [geoMap, setGeoMap] = useState<NPSFeature[]>(
    geoJson.features as NPSFeature[]
  );
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const isRestoringFromUrl = useRef(false);
  const isInitialized = useRef(false);

  // Update URL with current map state
  const updateURL = (
    parkCode: string | null,
    center: [number, number] | null,
    zoomLevel: number | null,
    skipPush = false
  ) => {
    if (isRestoringFromUrl.current) return;

    const params = new URLSearchParams(searchParams.toString());

    if (parkCode) {
      const park = getLocalNPSbyCode(parkCode);
      if (park) {
        const slug = getSlugFromName(park.properties.Name);
        params.set("park", slug);
      }
    } else {
      params.delete("park");
    }

    if (center && zoomLevel) {
      params.set("lng", center[0].toFixed(6));
      params.set("lat", center[1].toFixed(6));
      params.set("zoom", zoomLevel.toFixed(2));
    }

    const url = params.toString() ? `/?${params.toString()}` : "/";

    if (skipPush) {
      router.replace(url, { scroll: false });
    } else {
      router.push(url, { scroll: false });
    }
  };

  // Restore map state from URL
  const restoreFromURL = () => {
    if (!map.current || !isInitialized.current) return;

    const parkSlug = searchParams.get("park");
    const urlLng = searchParams.get("lng");
    const urlLat = searchParams.get("lat");
    const urlZoom = searchParams.get("zoom");

    isRestoringFromUrl.current = true;

    if (parkSlug) {
      const parkCode = getLocalNPSbyName(parkSlug);
      if (parkCode) {
        const park = getLocalNPSbyCode(parkCode);
        if (park) {
          // Restore map position from URL or use park location
          const center: [number, number] =
            urlLng && urlLat
              ? [parseFloat(urlLng), parseFloat(urlLat)]
              : (park.geometry.coordinates as [number, number]);
          const zoomLevel = urlZoom ? parseFloat(urlZoom) : 8.5;

          map.current.flyTo({
            center: center,
            zoom: zoomLevel,
            duration: 2000,
            essential: true,
          });

          // Show popup for the park
          setTimeout(() => {
            createPopUp(park);
          }, 500);
        }
      }
    } else if (urlLng && urlLat) {
      // Restore map position without park
      const center: [number, number] = [parseFloat(urlLng), parseFloat(urlLat)];
      const zoomLevel = urlZoom ? parseFloat(urlZoom) : 5;

      map.current.flyTo({
        center: center,
        zoom: zoomLevel,
        duration: 2000,
        essential: true,
      });

      filterMap(
        {
          coordinates: center,
        },
        false
      );
    }

    setTimeout(() => {
      isRestoringFromUrl.current = false;
    }, 1000);
  };

  //fetch data to find the users IP and then center and zoom the map to that area
  const getIP = async () => {
    // Only get IP if there's no park in URL
    if (!searchParams.get("park")) {
      const response = await fetch("/api/getip");
      const data = await response.json();
      setLng(data.longitude);
      setLat(data.latitude);
    }
  };

  // Get IP on mount (only if no park in URL)
  useEffect(() => {
    getIP();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //center and zoom the map to the users IP (only if no park in URL)
  useEffect(() => {
    if (!map.current || !isInitialized.current) return;
    if (searchParams.get("park")) return; // Don't override URL-based position

    map.current.flyTo({
      center: [lng, lat],
      zoom: 5,
      duration: 3000,
      essential: true,
    });
    filterMap(
      {
        coordinates: [lng, lat],
      },
      false
    );
    updateURL(null, [lng, lat], 5, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lng, lat, searchParams]);

  //Load map, add locations and set onClick
  useEffect(() => {
    if (map.current || !mapContainer.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style:
        process.env.NEXT_PUBLIC_MAPBOX_STYLE ||
        "mapbox://styles/mapbox/outdoors-v12",
      center: [lng, lat],
      zoom: zoom,
      pitch: pitch,
      cooperativeGestures: true,
    });

    map.current.on("load", function () {
      if (!map.current) return;

      // Add points custom marker
      map.current.addSource("points", {
        type: "geojson",
        cluster: true,
        clusterMaxZoom: 8,
        data: {
          type: "FeatureCollection",
          features: geoMap,
        },
      });

      map.current.addLayer({
        id: "clusters",
        source: "points",
        filter: ["has", "point_count"],
        type: "circle",
        paint: {
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#92400e", // amber-800
            20,
            "#b45309", // amber-700
            100,
            "#d97706", // amber-600
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            20,
            30,
            100,
            40,
          ],
        },
      });

      map.current.addLayer({
        id: "unclustered-point",
        source: "points",
        filter: ["!", ["has", "point_count"]],
        type: "circle",
        paint: {
          "circle-radius": 7,
          "circle-color": "#b45309", // amber-700
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });

      // inspect a cluster on click
      map.current.on("click", "clusters", (e) => {
        if (!map.current) return;
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        const feature = features[0];
        if (!feature || !feature.properties) return;
        const clusterId = feature.properties.cluster_id;
        const source = map.current.getSource(
          "points"
        ) as mapboxgl.GeoJSONSource;
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || !map.current || zoom === null || zoom === undefined)
            return;
          if (feature.geometry.type !== "Point") return;

          const center = feature.geometry.coordinates as [number, number];
          map.current.easeTo({
            center: center,
            zoom: zoom,
          });

          // Update URL with new position
          setTimeout(() => {
            updateURL(null, center, zoom);
          }, 100);
        });
      });

      //Check for click on point on map
      map.current.on("click", "unclustered-point", (e) => {
        if (!map.current) return;
        /* Determine if a feature in the "locations" layer exists at that item. */
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ["unclustered-point"],
        });

        /* If it does not exist, return */
        if (!features.length) return;

        const clickedPoint = features[0] as unknown as NPSFeature;

        /* Fly to the point */
        flyToLocation(map, clickedPoint);

        /* Close all other popups and display popup for clicked item */
        createPopUp(clickedPoint);

        // Update URL with selected park and position
        setTimeout(() => {
          if (!map.current) return;
          const center = clickedPoint.geometry.coordinates as [number, number];
          const currentZoom = map.current.getZoom();
          updateURL(clickedPoint.properties.Code, center, currentZoom);
        }, 100);
      });

      // Change the cursor to a pointer when the mouse is over the places layer.
      map.current.on("mouseenter", "unclustered-point", () => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = "pointer";
      });

      // Change it back to a pointer when it leaves.
      map.current.on("mouseleave", "unclustered-point", () => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = "";
      });

      // Change the cursor to a pointer when the mouse is over the places layer.
      map.current.on("mouseenter", "clusters", () => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = "pointer";
      });

      // Change it back to a pointer when it leaves.
      map.current.on("mouseleave", "clusters", () => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = "";
      });

      // Mark map as initialized
      isInitialized.current = true;

      // Restore from URL on initial load
      restoreFromURL();
    });

    /*
     * Add my location button
     */
    const geolocate = new mapboxgl.GeolocateControl();
    map.current.addControl(geolocate);
    geolocate.on("geolocate", (event) => {
      const center: [number, number] = [
        event.coords.longitude,
        event.coords.latitude,
      ];
      filterMap(
        {
          coordinates: center,
        },
        true
      );
      // URL will be updated by filterMap
    });

    /*
     * Add navigation control (the +/- zoom buttons)
     */
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    /**
     * Geo search input
     */
    //set up a new geo search
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken!,
      mapboxgl: mapboxgl,
      countries: "us",
      marker: false,
      proximity: "ip",
      trackProximity: false,
      placeholder: "City, State, or Zip",
    });

    //add geo search to map
    map.current.addControl(geocoder, "top-left");

    //after users searches and clicks on a result
    geocoder.on("result", (event) => {
      //sort items from nearest to farthest distance from search location
      filterMap(event.result.geometry as SearchResult);
      // URL will be updated by filterMap
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createPopUp = (currentItem: NPSFeature) => {
    if (!map.current || !popUpElement.current) return;

    setSelectedItem(currentItem.properties.Code);

    const coordinates = currentItem.geometry.coordinates.slice() as [
      number,
      number
    ];

    // Close existing popups
    const existingPopups = document.getElementsByClassName("mapboxgl-popup");
    for (let i = 0; i < existingPopups.length; i++) {
      existingPopups[i].remove();
    }

    //mapbox popup offset to center on custom marker - https://docs.mapbox.com/mapbox-gl-js/api/markers/#popup
    new mapboxgl.Popup({
      offset: [0, -10],
      className: "mapbox-popup-custom",
    })
      .setLngLat(coordinates)
      .setDOMContent(popUpElement.current)
      .addTo(map.current);
  };

  //only used if we show the full list of locations
  const filterMap = (searchResult: SearchResult, showPopup = true) => {
    if (!map.current) return;

    const sortedGeoMap = sortItems(searchResult, searchRadius);

    //set the sorted array to the geoMap
    setGeoMap(sortedGeoMap);

    //fit map zoom to the search location and closest location - https://turfjs.org/docs/#bbox
    if (showPopup && sortedGeoMap.length > 0) {
      const bbox = turf.bbox(
        turf.lineString([
          sortedGeoMap[0].geometry.coordinates as [number, number],
          searchResult.coordinates,
        ])
      );
      // Extract 2D bbox [minX, minY, maxX, maxY] from potentially 3D bbox
      const bounds: [number, number, number, number] = [
        bbox[0],
        bbox[1],
        bbox[2],
        bbox[3],
      ];
      map.current.fitBounds(bounds, { padding: 100 });

      // open popup box for the closest location
      createPopUp(sortedGeoMap[0]);

      // Update URL after bounds change
      setTimeout(() => {
        if (!map.current) return;
        const center = map.current.getCenter();
        const zoom = map.current.getZoom();
        updateURL(
          sortedGeoMap[0].properties.Code,
          [center.lng, center.lat],
          zoom
        );
      }, 100);
    }
  };

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      restoreFromURL();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <>
      <div className='flex flex-wrap md:flex-nowrap overflow-hidden md:h-[70dvh] relative'>
        <section
          ref={mapContainer}
          className='w-full h-[70dvh] md:h-full overflow-hidden'
        />
      </div>
      <div ref={popUpElement}>
        <LocationPopup selectedItem={selectedItem} />
      </div>
    </>
  );
};

export default Map;
