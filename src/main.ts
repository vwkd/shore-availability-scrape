import { CRON_SCHEDULE } from "./config.ts";
import { Database } from "./database.ts";

console.info(
  `Starting Shore availability notifier on schedule '${CRON_SCHEDULE}'...`,
);

const kv = await Deno.openKv();

const db = await Database.create(kv);

Deno.serve(() =>
  new Response(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shore available slots</title>
</head>
<body>
  <h1>Shore available slots</h1>
  ${
      Array.from(db.availableSlots.entries()).map(([date, times]) => `
    <div>
      <h2>${date}</h2>
      <ul>
        ${Array.from(times).map((time) => `<li>${time}</li>`).join("\n")}
      </ul>
    </div>
    `).join("\n")
    }
</body>
</html>`,
    {
      headers: {
        "Content-Type": "text/html",
      },
    },
  )
);

if (CRON_SCHEDULE) {
  Deno.cron(
    "check available slots",
    CRON_SCHEDULE!,
    db.updateAvailableSlots.bind(db),
  );
}
