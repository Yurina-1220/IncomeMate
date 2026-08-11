import { NextResponse } from "next/server";

const ownPublishedShifts = [
  { day: 10, start: "17:30", end: "19:30" },
  { day: 12, start: "10:00", end: "16:00" },
  { day: 18, start: "10:15", end: "16:00" },
  { day: 20, start: "10:00", end: "15:00" },
  { day: 26, start: "11:00", end: "15:00" },
  { day: 28, start: "16:00", end: "22:00" },
];

export async function GET() {
  return NextResponse.json({
    syncedAt: new Date().toISOString(),
    source: "Dinii",
    shop: "WILDBEACH川口",
    employee: "後藤 佑里菜",
    shifts: ownPublishedShifts.map((shift, index) => ({
      id: 9000 + index,
      dinniiShiftId: `wildbeach-2026-07-${String(shift.day).padStart(2, "0")}`,
      month: 6,
      day: shift.day,
      title: "WILDBEACH川口（確定シフト）",
      source: "わいび",
      start: shift.start,
      end: shift.end,
      colorId: "10",
    })),
  });
}
