export interface SlotsResponse {
  slots: Slot[];
  next_available_date: null;
  slot_duration: number;
}

export interface Slot {
  times: string[];
  date: string;
  id: string;
}
