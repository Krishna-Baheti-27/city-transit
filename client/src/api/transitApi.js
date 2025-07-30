// File: client/src/api/transitApi.js
// This file will contain all API calls related to routes, stops, etc.

import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/routes`;

/**
 * Fetches all available stops from the backend.
 * @returns {Promise<Array>} A promise that resolves to an array of stop objects.
 */
export const getAllStops = async () => {
  try {
    const res = await axios.get(`${API_URL}/stops/all`);
    return res.data;
  } catch (error) {
    console.error("Error fetching stops:", error);
    throw error;
  }
};

/**
 * Finds direct routes between a source and destination stop.
 * @param {string} fromStopId - The ID of the source stop.
 * @param {string} toStopId - The ID of the destination stop.
 * @returns {Promise<Array>} A promise that resolves to an array of journey objects.
 */
export const findRoutes = async (fromStopId, toStopId) => {
  try {
    const res = await axios.post(`${API_URL}/find`, { fromStopId, toStopId });
    return res.data;
  } catch (error) {
    console.error("Error finding routes:", error);
    throw error;
  }
};
