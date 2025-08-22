const USER_AGENT = Deno.env.get("USER_AGENT");

if (!USER_AGENT) {
  throw new Error("Missing env var 'USER_AGENT'");
}

const SHORE_SERVICE_ID = Deno.env.get("SHORE_SERVICE_ID");

if (!SHORE_SERVICE_ID) {
  throw new Error("Missing env var 'SHORE_SERVICE_ID'");
}

const SHORE_MERCHANT_ID = Deno.env.get("SHORE_MERCHANT_ID");

if (!SHORE_MERCHANT_ID) {
  throw new Error("Missing env var 'SHORE_MERCHANT_ID'");
}

const SHORE_TIMEZONE = Deno.env.get("SHORE_TIMEZONE");

if (!SHORE_TIMEZONE) {
  throw new Error("Missing env var 'SHORE_TIMEZONE'");
}

const SHORE_STARTS_AT = Deno.env.get("SHORE_STARTS_AT");

if (!SHORE_STARTS_AT) {
  throw new Error("Missing env var 'SHORE_STARTS_AT'");
}

const SHORE_ENDS_AT = Deno.env.get("SHORE_ENDS_AT");

if (!SHORE_ENDS_AT) {
  throw new Error("Missing env var 'SHORE_ENDS_AT'");
}

const NTFY_TOPIC = Deno.env.get("NTFY_TOPIC");

if (!NTFY_TOPIC) {
  throw new Error("Missing env var 'NTFY_TOPIC'");
}

const CRON_SCHEDULE = Deno.env.get("CRON_SCHEDULE");

export {
  CRON_SCHEDULE,
  NTFY_TOPIC,
  SHORE_ENDS_AT,
  SHORE_MERCHANT_ID,
  SHORE_SERVICE_ID,
  SHORE_STARTS_AT,
  SHORE_TIMEZONE,
  USER_AGENT,
};
