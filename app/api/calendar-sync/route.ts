import { NextResponse } from "next/server";

const googleCalendarEvents = [
  { id: "od5d99ptur4k1eip8d2tcomfik", title: "にぼる（アルバイト）", colorId: "10", start: "2026-07-22T11:00:00+09:00", end: "2026-07-22T15:00:00+09:00" },
  { id: "d0vja1opktf2q7k6ifi9dikn5g", title: "町田（アルバイト）", colorId: "10", start: "2026-07-23T11:00:00+09:00", end: "2026-07-23T15:00:00+09:00" },
  { id: "7tm3fbs3bg88i30k8vm5em4tls", title: "にぼる（アルバイト）", colorId: "10", start: "2026-07-24T11:00:00+09:00", end: "2026-07-24T15:00:00+09:00" },
  { id: "0jusaq6lj62eb3c2brs7vtibi8", title: "町田（アルバイト）", colorId: "10", start: "2026-07-25T11:00:00+09:00", end: "2026-07-25T15:00:00+09:00" },
  { id: "7jf0entdgeiq45l87g0m9vq15o", title: "そばや（アルバイト）", colorId: "10", start: "2026-07-27T11:00:00+09:00", end: "2026-07-27T14:00:00+09:00" },
  { id: "am8ek7m8sc45e8ebaf0h8u8mu8", title: "イベント（アルバイト）", colorId: "10", start: "2026-07-29T00:00:00+09:00", end: "2026-07-31T00:00:00+09:00" },
  { id: "7b607dedm5p6f2u1gnp9kee29s", title: "町田（アルバイト）", colorId: "10", start: "2026-07-31T11:00:00+09:00", end: "2026-07-31T15:00:00+09:00" },
  { id: "9qgtrb8ofcog6mhka9p34it1tk", title: "イベント（アルバイト）", colorId: "10", start: "2026-08-02T00:00:00+09:00", end: "2026-08-03T00:00:00+09:00" },
  { id: "102mnv83i3aopcq340p7o7ggcs", title: "イベント（アルバイト）", colorId: "10", start: "2026-08-04T00:00:00+09:00", end: "2026-08-05T00:00:00+09:00" },
  { id: "k1mkm2ko8tlqsahpidtlb7cdo0", title: "イベント（アルバイト）", colorId: "10", start: "2026-08-05T00:00:00+09:00", end: "2026-08-06T00:00:00+09:00" },
  { id: "68iopgqhu12mfsb9nfoas03a7c", title: "イベント（アルバイト）", colorId: "10", start: "2026-08-09T00:00:00+09:00", end: "2026-08-10T00:00:00+09:00" },
  { id: "91ttddft162clvs85vikv5qdgs", title: "そばや（アルバイト）", colorId: "10", start: "2026-08-10T11:00:00+09:00", end: "2026-08-10T14:00:00+09:00" },
  { id: "k2jbv7ni4n32qqs1lg508ak13o", title: "そばや（アルバイト）", colorId: "10", start: "2026-08-17T11:00:00+09:00", end: "2026-08-17T14:00:00+09:00" },
  { id: "tcd1lqjcmq7mk34q3kvfl2vp78", title: "そばや（アルバイト）", colorId: "10", start: "2026-08-18T11:00:00+09:00", end: "2026-08-18T14:00:00+09:00" },
  { id: "tbc23tnr0456ndcmar3plmj1ls", title: "そばや（アルバイト）", colorId: "10", start: "2026-08-31T11:00:00+09:00", end: "2026-08-31T14:00:00+09:00" },
];

const sourceOf = (title: string) => {
  if (title.includes("にぼる") || title.includes("町田")) return "タイミー";
  if (title.includes("そばや")) return "そばや";
  if (title.includes("イベント")) return "イベント";
  return title.replace("（アルバイト）", "");
};

const timeOf = (date: Date) => date.toLocaleTimeString("ja-JP", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Tokyo",
});

export async function GET() {
  const shifts = googleCalendarEvents
    .filter(event => event.colorId === "10")
    .map((event, index) => {
      const start = new Date(event.start);
      const end = new Date(event.end);
      return {
        id: index + 1,
        googleEventId: event.id,
        month: start.getMonth(),
        day: start.getDate(),
        title: event.title,
        source: sourceOf(event.title),
        start: timeOf(start),
        end: timeOf(end),
        colorId: event.colorId,
      };
    });

  return NextResponse.json({
    syncedAt: new Date().toISOString(),
    colorId: "10",
    source: "Google Calendar",
    shifts,
  });
}
