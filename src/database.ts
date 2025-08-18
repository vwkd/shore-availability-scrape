import { SHORE_TIMEZONE } from "./config.ts";
import { getSlots } from "./get.ts";
import { sendNotification } from "./notify.ts";

const MAX_BATCH_SIZE = 500;
const KV_PREFIX = ["availableSlots"] as const;
const DEFAULT_VALUE = true;

/**
 * Database for available slots
 */
export class Database {
  #initialized = false;
  #kv: Deno.Kv;
  #availableSlots: Map<string, Set<string>> = new Map();

  private constructor(kv: Deno.Kv) {
    this.#kv = kv;
  }

  /**
   * Create new database instance
   *
   * @param kv Deno KV store
   * @returns Database instance
   */
  static async create(kv: Deno.Kv): Promise<Database> {
    const database = new Database(kv);

    await database.#initialize();

    return database;
  }

  /**
   * Add new slot to database and send notification
   *
   * @param now current time
   * @param date date of slot, in `YYYY-MM-DD` format
   * @param time time of slot, in `HH:mm` format
   */
  async #addSlot(
    now: Temporal.Instant,
    date: string,
    time: string,
  ): Promise<void> {
    console.debug(`Add slot: ${date} ${time}`);

    const dateObj = Temporal.ZonedDateTime.from(
      `${date}T${time}[${SHORE_TIMEZONE!}]`,
    );

    const expireIn = now.until(dateObj.toInstant(), {
      largestUnit: "millisecond",
    }).milliseconds;

    const key = [...KV_PREFIX, date, time] as const;
    await this.#kv.set(key, DEFAULT_VALUE, { expireIn });

    const dateStr = dateObj.toLocaleString("de-DE", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: SHORE_TIMEZONE!,
    });

    await sendNotification(dateStr);
  }

  /**
   * Initialize database
   *
   * - loads available slots from Deno KV or fetches from API if not yet stored
   */
  async #initialize(): Promise<void> {
    // run only once
    if (this.#initialized) {
      return;
    }

    const entriesIterator = this.#kv.list<typeof DEFAULT_VALUE>({
      prefix: KV_PREFIX,
    }, { batchSize: MAX_BATCH_SIZE });

    const entries = await Array.fromAsync(entriesIterator);

    console.debug(`Loaded ${entries.length} entries from database`);

    for (const entry of entries) {
      const [date, time] = (entry.key as string[]).slice(-2);

      if (!this.#availableSlots.has(date)) {
        const times = new Set([time]);
        this.#availableSlots.set(date, times);
      } else {
        this.#availableSlots.get(date)!.add(time);
      }
    }

    this.#initialized = true;

    await this.updateAvailableSlots();
  }

  /**
   * Remove slot from database
   *
   * @param date date of slot, in `YYYY-MM-DD` format
   * @param time time of slot, in `HH:mm` format
   */
  async #removeSlot(
    date: string,
    time: string,
  ): Promise<void> {
    console.debug(`Remove slot: ${date} ${time}`);

    const key = [...KV_PREFIX, date, time] as const;
    await this.#kv.delete(key);
  }

  /**
   * Get available slots
   *
   * @returns available slots
   */
  get availableSlots(): Map<string, Set<string>> {
    return this.#availableSlots;
  }

  /**
   * Update available slots
   *
   * - fetches available slots from API
   * - adds new to database and sends notification
   * - removes old from database
   */
  async updateAvailableSlots(): Promise<void> {
    console.debug("Update available slots...");

    const now = Temporal.Now.instant();

    const res = await getSlots();
    const slots = res.slots;

    // add new slots
    for (const { date, times } of slots) {
      if (!this.#availableSlots.has(date)) {
        this.#availableSlots.set(date, new Set());
      }

      const availableTimes = this.#availableSlots.get(date)!;

      for (const time of times) {
        if (!availableTimes.has(time)) {
          availableTimes.add(time);

          await this.#addSlot(now, date, time);
        }
      }
    }

    // remove old slots
    for (const [date, times] of this.#availableSlots.entries()) {
      for (const time of [...times]) {
        if (
          !slots.some((slot) => slot.date === date && slot.times.includes(time))
        ) {
          await this.#removeSlot(date, time);
          times.delete(time);
        }
      }

      if (times.size == 0) {
        this.#availableSlots.delete(date);
      }
    }
  }
}
