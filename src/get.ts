import type { SlotsResponse } from "./types.ts";

const API_URL = "https://api.shore.com/v2/availability/calculate_slots";

const HEADERS = {
  "Content-Type": "application/json;charset=utf-8",
  "Origin": "https://connect.shore.com",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.10 Safari/605.1.1",
  "X-Shore-Origin": "booking-widget",
};

/**
 * Fetch available Shore slots
 *
 * @param merchantId Merchant ID, e.g. "5d51c5bb-9ac8-4a7e-b270-da95a7cfd53f"
 * @param serviceId Service ID, e.g. "fd9344eb-c140-410d-b2e5-5ccd9b1b37a7"
 * @param timezone Timezone, e.g. "Europe/Amsterdam"
 * @param startDate Start date, in YYYY-MM-DD format, e.g. "2025-08-25"
 * @param endDate End date, in YYYY-MM-DD format, e.g. "2024-08-31"
 * @returns Response containing available slots
 */
export async function getSlots(
  merchantId: string,
  serviceId: string,
  timezone: string,
  startDate: string,
  endDate: string,
): Promise<SlotsResponse> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      required_capacity: "1",
      search_weeks_range: 0,
      services_resources: [{ service_id: serviceId }],
      timezone: timezone,
      starts_at: `${startDate} 00:00:00`,
      ends_at: `${endDate} 23:59:59`,
      merchant_id: merchantId,
    }),
  });

  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  return data;
}
