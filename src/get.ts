import {
  SHORE_ENDS_AT,
  SHORE_MERCHANT_ID,
  SHORE_SERVICE_ID,
  SHORE_STARTS_AT,
  SHORE_TIMEZONE,
  USER_AGENT,
} from "./config.ts";
import type { SlotsResponse } from "./types.ts";

const API_URL = "https://api.shore.com/v2/availability/calculate_slots";

const HEADERS = {
  "Content-Type": "application/json;charset=utf-8",
  "Origin": "https://connect.shore.com",
  "User-Agent": USER_AGENT!,
  "X-Shore-Origin": "booking-widget",
};

/**
 * Fetch available Shore slots
 *
 * @returns Response containing available slots
 */
export async function getSlots(): Promise<SlotsResponse> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      required_capacity: "1",
      search_weeks_range: 0,
      services_resources: [{ service_id: SHORE_SERVICE_ID! }],
      timezone: SHORE_TIMEZONE!,
      starts_at: SHORE_STARTS_AT!,
      ends_at: SHORE_ENDS_AT!,
      merchant_id: SHORE_MERCHANT_ID!,
    }),
  });

  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  return data;
}
