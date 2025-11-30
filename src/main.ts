import { Hono } from "@hono/hono";
import { getSlots } from "./get.ts";

console.info(`Serving Shore availability scraper...`);

const app = new Hono();

app.get(`/availability/:merchantId/:serviceId/:timezone/:startDate/:endDate`, async (c) => {
  // todo: validate parameters
  const merchantId = c.req.param("merchantId");
  const serviceId = c.req.param("serviceId");
  const timezone = c.req.param("timezone");
  const startDate = c.req.param("startDate");
  const endDate = c.req.param("endDate");

  console.debug("Got request:", c.req.path);

  const res = await getSlots(merchantId, serviceId, timezone, startDate, endDate);
  const slots = res.slots;

  return Response.json(slots);
});

Deno.serve(app.fetch);
