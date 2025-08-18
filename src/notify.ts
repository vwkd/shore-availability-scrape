import { NTFY_TOPIC } from "./config.ts";

const NTFY_BASE_URL = "https://ntfy.sh/";

/**
 * Send NTFY notification for new slot
 *
 * @param availableSlot available slot
 */
export async function sendNotification(availableSlot: string): Promise<void> {
  const res = await fetch(NTFY_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic: NTFY_TOPIC!,
      title: `New Shore slot`,
      message: availableSlot,
    }),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to send notification: ${res.status} ${res.statusText}`,
    );
  }
}
