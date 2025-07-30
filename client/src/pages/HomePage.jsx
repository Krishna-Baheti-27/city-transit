// File: client/src/pages/HomePage.jsx
// The home page is now fully interactive, fetching stops and finding routes.

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { getAllStops, findRoutes } from "../api/transitApi"; // Import our new API functions

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 21.1702,
  lng: 72.8311,
};

// **PERFORMANCE FIX:** Define libraries array outside the component to prevent re-renders.
const libraries = ["places"];

const HomePage = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries, // Use the constant variable here
  });

  // State management
  const [allStops, setAllStops] = useState([]);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [journeys, setJourneys] = useState([]);
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all stops when the component mounts
  useEffect(() => {
    const fetchStops = async () => {
      try {
        const stopsData = await getAllStops();
        // We check if the returned data is an array before setting the state.
        if (Array.isArray(stopsData)) {
          setAllStops(stopsData);
        } else {
          // This error occurs when the API call fails and returns HTML instead of JSON.
          // This is usually due to a server-side routing or proxy issue.
          console.error(
            "API did not return an array for stops. Check server proxy/routing.",
            stopsData
          );
          setError("Could not fetch stops. Please check server configuration.");
        }
      } catch (err) {
        setError("Could not fetch stops. Please try again later.");
      }
    };
    fetchStops();
  }, []);

  // Handle the route search
  const handleSearch = async () => {
    if (!source || !destination) {
      setError("Please select a source and destination.");
      return;
    }
    if (source === destination) {
      setError("Source and destination cannot be the same.");
      return;
    }

    setLoading(true);
    setError("");
    setJourneys([]);
    setSelectedJourney(null);

    try {
      const results = await findRoutes(source, destination);
      setJourneys(results);
      if (results.length > 0) {
        setSelectedJourney(results[0]);
      } else {
        setError("No direct routes found between these stops.");
      }
    } catch (err) {
      setError("Failed to find routes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] -mt-4">
      {/* Left Panel */}
      <motion.div
        className="w-full md:w-1/3 bg-white p-6 shadow-2xl z-10 overflow-y-auto"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Go anywhere</h1>
        {error && (
          <div className="p-3 my-4 text-sm text-red-700 bg-red-100 rounded-lg animate-shake">
            {error}
          </div>
        )}
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
          <div className="space-y-4">
            {/* Source Dropdown */}
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            >
              <option value="">Select pickup location</option>
              {allStops.map((stop) => (
                <option key={stop._id} value={stop._id}>
                  {stop.name}
                </option>
              ))}
            </select>
            {/* Destination Dropdown */}
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            >
              <option value="">Select destination</option>
              {allStops.map((stop) => (
                <option key={stop._id} value={stop._id}>
                  {stop.name}
                </option>
              ))}
            </select>
            <motion.button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-black text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:bg-gray-500"
            >
              {loading ? "Searching..." : "See prices"}
            </motion.button>
          </div>
        </div>

        {/* Results Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800">Suggestions</h2>
          <div className="mt-4 space-y-3">
            {journeys.length > 0 ? (
              journeys.map((journey, index) => (
                <motion.div
                  key={index}
                  onClick={() => setSelectedJourney(journey)}
                  className={`p-4 rounded-lg cursor-pointer border-2 ${
                    selectedJourney?.routeId === journey.routeId
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="font-bold text-lg">
                    {journey.routeName} ({journey.routeType})
                  </div>
                  <div className="text-sm text-gray-600">
                    {journey.stops.length} stops
                  </div>
                  {journey.fare !== null && (
                    <div className="text-md font-semibold mt-1">
                      ₹{journey.fare.toFixed(2)}
                    </div>
                  )}
                  {journey.alert && (
                    <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 text-sm rounded-md">
                      <strong>Alert:</strong> {journey.alert.title}
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="p-6 bg-gray-100 rounded-lg text-center text-gray-500">
                <p>Your route options will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Right Panel: Map */}
      <motion.div
        className="hidden md:block w-2/3 bg-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        {loadError && <div>Error loading maps</div>}
        {!isLoaded && !loadError && (
          <div className="flex items-center justify-center h-full">
            <p className="text-2xl text-gray-500">Loading Map...</p>
          </div>
        )}
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={13}
            options={{ disableDefaultUI: true, zoomControl: true }}
          >
            {selectedJourney && (
              <>
                <Polyline
                  path={selectedJourney.path.coordinates.map((p) => ({
                    lat: p[1],
                    lng: p[0],
                  }))}
                  options={{
                    strokeColor: selectedJourney.routeColor || "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: 6,
                  }}
                />
                {selectedJourney.stops.map((stop) => (
                  <Marker
                    key={stop._id}
                    position={{
                      lat: stop.location.coordinates[1],
                      lng: stop.location.coordinates[0],
                    }}
                    title={stop.name}
                  />
                ))}
              </>
            )}
          </GoogleMap>
        )}
      </motion.div>
    </div>
  );
};

export default HomePage;
