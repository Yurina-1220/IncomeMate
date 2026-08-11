"use client";

import { useEffect, useMemo, useState } from "react";

type View = "home" | "calendar" | "jobs";
type Payment = "振込" | "手渡し";

type Job = {
  id: number;
  name: string;
  kind: string;
  hourlyWage: number;
  transport: string;
  overtimeNote: string;
  payment: Payment;
  dependent: boolean;
  total: number;
  color: string;
};

type Shift = {
  id: number;
  googleEventId?: string;
  dinniiShiftId?: string;
  month: number;
  day: number;
  title: string;
  source: string;
  start: string;
  end: string;
  colorId: "10";
};

type IncomeRow = {
  name: string;
  values: number[];
  cash: boolean;
};

type TimeyCase = {
  id: number;
  name: string;
  hours: string;
  amount: number;
};

type CloudSnapshot = {
  jobs: Job[];
  shifts: Shift[];
  incomeRows: IncomeRow[];
  timeyCases: TimeyCase[];
};

const initialJobs: Job[] = [
  { id: 1, name: "吉野家", kind: "固定アルバイト", hourlyWage: 0, transport: "", overtimeNote: "自動計算", payment: "振込", dependent: true, total: 563659, color: "#2563eb" },
  { id: 2, name: "わいび", kind: "固定アルバイト", hourlyWage: 0, transport: "", overtimeNote: "自動計算", payment: "振込", dependent: true, total: 132079, color: "#0ea5e9" },
  { id: 3, name: "タイミー", kind: "単発・スポット勤務", hourlyWage: 0, transport: "", overtimeNote: "案件ごとに記録", payment: "振込", dependent: true, total: 176550, color: "#22c55e" },
  { id: 4, name: "イベント", kind: "単発イベント", hourlyWage: 0, transport: "", overtimeNote: "自動計算", payment: "手渡し", dependent: false, total: 97500, color: "#f59e0b" },
  { id: 5, name: "そばや", kind: "飲食店アルバイト", hourlyWage: 0, transport: "", overtimeNote: "自動計算", payment: "手渡し", dependent: false, total: 30000, color: "#8b5cf6" },
];

const monthly = [
  ["1月", 107775], ["2月", 175479], ["3月", 106496], ["4月", 123494],
  ["5月", 150429], ["6月", 153600], ["7月", 182515],
] as const;

const initialIncomeRows: IncomeRow[] = [
  { name: "吉野家", values: [103597, 171301, 97966, 108681, 8336, 4170, 69608], cash: false },
  { name: "わいび", values: [0, 0, 0, 0, 0, 59402, 72677], cash: false },
  { name: "タイミー", values: [4178, 4178, 8530, 14813, 72093, 60028, 12730], cash: false },
  { name: "イベント", values: [0, 0, 0, 0, 70000, 0, 27500], cash: true },
  { name: "そばや", values: [0, 0, 0, 0, 0, 30000, 0], cash: true },
];

const initialTimeyCases: TimeyCase[] = [
  { id: 1, name: "にぼる", hours: "4時間", amount: 4178 },
  { id: 2, name: "町田", hours: "4時間", amount: 4178 },
  { id: 3, name: "にぼる", hours: "4時間", amount: 4374 },
];

const initialShifts: Shift[] = [
  { id: 1, month: 6, day: 22, title: "にぼる（アルバイト）", source: "タイミー", start: "11:00", end: "15:00", colorId: "10" },
  { id: 2, month: 6, day: 23, title: "町田（アルバイト）", source: "タイミー", start: "11:00", end: "15:00", colorId: "10" },
  { id: 3, month: 6, day: 24, title: "にぼる（アルバイト）", source: "タイミー", start: "11:00", end: "15:00", colorId: "10" },
  { id: 4, month: 6, day: 25, title: "町田（アルバイト）", source: "タイミー", start: "11:00", end: "15:00", colorId: "10" },
  { id: 5, month: 6, day: 27, title: "そばや（アルバイト）", source: "そばや", start: "11:00", end: "14:00", colorId: "10" },
  { id: 6, month: 6, day: 29, title: "イベント（アルバイト）", source: "イベント", start: "09:00", end: "18:00", colorId: "10" },
  { id: 7, month: 6, day: 31, title: "町田（アルバイト）", source: "タイミー", start: "11:00", end: "15:00", colorId: "10" },
  { id: 8, month: 7, day: 2, title: "イベント（アルバイト）", source: "イベント", start: "09:00", end: "18:00", colorId: "10" },
  { id: 9, month: 7, day: 4, title: "イベント（アルバイト）", source: "イベント", start: "09:00", end: "18:00", colorId: "10" },
  { id: 10, month: 7, day: 5, title: "イベント（アルバイト）", source: "イベント", start: "09:00", end: "18:00", colorId: "10" },
  { id: 11, month: 7, day: 9, title: "イベント（アルバイト）", source: "イベント", start: "09:00", end: "18:00", colorId: "10" },
  { id: 12, month: 7, day: 10, title: "そばや（アルバイト）", source: "そばや", start: "11:00", end: "14:00", colorId: "10" },
  { id: 13, month: 7, day: 17, title: "そばや（アルバイト）", source: "そばや", start: "11:00", end: "14:00", colorId: "10" },
  { id: 14, month: 7, day: 18, title: "そばや（アルバイト）", source: "そばや", start: "11:00", end: "14:00", colorId: "10" },
  { id: 15, month: 7, day: 31, title: "そばや（アルバイト）", source: "そばや", start: "11:00", end: "14:00", colorId: "10" },
];

const monthNames = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
const weekdays = ["日","月","火","水","木","金","土"];
const yen = (value: number) => new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(value);
const minutesOf = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const calculatePay = (shift: Shift, hourlyWage: number) => {
  if (!hourlyWage) return { total: 0, normal: 0, overtime: 0, night: 0, doublePremium: 0, minutes: Math.max(0, minutesOf(shift.end) - minutesOf(shift.start)) };
  const start = minutesOf(shift.start);
  const end = minutesOf(shift.end) <= start ? minutesOf(shift.end) + 1440 : minutesOf(shift.end);
  let total = 0;
  const buckets = { normal: 0, overtime: 0, night: 0, doublePremium: 0 };
  for (let minute = start; minute < end; minute += 1) {
    const worked = minute - start;
    const clock = minute % 1440;
    const isOvertime = worked >= 480;
    const isNight = clock >= 1320 || clock < 300;
    const rate = isOvertime && isNight ? 1.5 : isOvertime || isNight ? 1.25 : 1;
    total += hourlyWage / 60 * rate;
    if (rate === 1.5) buckets.doublePremium += 1;
    else if (isOvertime) buckets.overtime += 1;
    else if (isNight) buckets.night += 1;
    else buckets.normal += 1;
  }
  return { total: Math.round(total), minutes: end - start, ...buckets };
};

export default function Dashboard({ user, logoutUrl }: {
  user: { displayName: string; email: string };
  logoutUrl: string;
}) {
  const [view, setView] = useState<View>("home");
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [incomeRows, setIncomeRows] = useState<IncomeRow[]>(initialIncomeRows);
  const [timeyCases, setTimeyCases] = useState<TimeyCase[]>(initialTimeyCases);
  const [selectedShiftId, setSelectedShiftId] = useState(3);
  const [calendarMonth, setCalendarMonth] = useState(6);
  const [showNewJob, setShowNewJob] = useState(false);
  const [showNewShift, setShowNewShift] = useState(false);
  const [syncStatus, setSyncStatus] = useState("自動同期 ON");
  const [syncedAt, setSyncedAt] = useState("");
  const [diniiStatus, setDiniiStatus] = useState("連携確認済み");
  const [diniiSyncedAt, setDiniiSyncedAt] = useState("");
  const [cloudStatus, setCloudStatus] = useState("Supabase 未接続");
  const [cloudSyncedAt, setCloudSyncedAt] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedJobs = localStorage.getItem("incomemate-jobs") ?? localStorage.getItem("shiftpay-jobs");
    const savedShifts = localStorage.getItem("incomemate-shifts") ?? localStorage.getItem("shiftpay-shifts");
    const savedIncomeRows = localStorage.getItem("incomemate-income-rows") ?? localStorage.getItem("shiftpay-income-rows");
    const savedTimeyCases = localStorage.getItem("incomemate-timey-cases") ?? localStorage.getItem("shiftpay-timey-cases");
    if (savedJobs) {
      setJobs(JSON.parse(savedJobs).map((job: Job) => job.name === "タイミー"
        ? { ...job, hourlyWage: 0, transport: "", overtimeNote: "案件ごとに記録" }
        : job
      ));
    }
    if (savedShifts) setShifts(JSON.parse(savedShifts));
    if (savedIncomeRows) setIncomeRows(JSON.parse(savedIncomeRows));
    if (savedTimeyCases) {
      setTimeyCases(JSON.parse(savedTimeyCases).map((item: TimeyCase & { title?: string; memo?: string }) => ({
        id: item.id,
        name: item.name ?? item.title ?? "",
        hours: item.hours ?? "",
        amount: item.amount ?? 0,
      })));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  useEffect(() => { localStorage.setItem("incomemate-jobs", JSON.stringify(jobs)); }, [jobs]);
  useEffect(() => { localStorage.setItem("incomemate-shifts", JSON.stringify(shifts)); }, [shifts]);
  useEffect(() => { localStorage.setItem("incomemate-income-rows", JSON.stringify(incomeRows)); }, [incomeRows]);
  useEffect(() => { localStorage.setItem("incomemate-timey-cases", JSON.stringify(timeyCases)); }, [timeyCases]);

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    const loadCloudSnapshot = async () => {
      try {
        const response = await fetch(`/api/supabase-snapshot?email=${encodeURIComponent(user.email)}`, { cache: "no-store" });
        if (response.status === 503) {
          if (!cancelled) setCloudStatus("Supabase 未接続");
          return;
        }
        if (!response.ok) throw new Error("cloud read failed");
        const data = await response.json() as { snapshot?: Partial<CloudSnapshot> | null; updatedAt?: string | null };
        if (cancelled) return;
        if (data.snapshot) {
          if (data.snapshot.jobs) setJobs(data.snapshot.jobs);
          if (data.snapshot.shifts) setShifts(data.snapshot.shifts);
          if (data.snapshot.incomeRows) setIncomeRows(data.snapshot.incomeRows);
          if (data.snapshot.timeyCases) setTimeyCases(data.snapshot.timeyCases);
          setCloudStatus("Supabase 同期中");
          if (data.updatedAt) setCloudSyncedAt(new Date(data.updatedAt).toLocaleString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }));
        } else {
          setCloudStatus("Supabase 保存待ち");
        }
      } catch {
        if (!cancelled) setCloudStatus("Supabase 読み込みエラー");
      }
    };
    loadCloudSnapshot();
    return () => { cancelled = true; };
  }, [hydrated, user.email]);

  useEffect(() => {
    if (!hydrated) return;
    const timer = window.setTimeout(async () => {
      try {
        const snapshot: CloudSnapshot = { jobs, shifts, incomeRows, timeyCases };
        const response = await fetch("/api/supabase-snapshot", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, snapshot }),
        });
        if (response.status === 503) {
          setCloudStatus("Supabase 未接続");
          return;
        }
        if (!response.ok) throw new Error("cloud save failed");
        const data = await response.json() as { updatedAt?: string };
        setCloudStatus("Supabase 保存済み");
        if (data.updatedAt) setCloudSyncedAt(new Date(data.updatedAt).toLocaleString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }));
      } catch {
        setCloudStatus("Supabase 保存エラー");
      }
    }, 900);
    return () => window.clearTimeout(timer);
  }, [hydrated, jobs, shifts, incomeRows, timeyCases, user.email]);

  const syncCalendar = async () => {
    setSyncStatus("同期中");
    try {
      const response = await fetch("/api/calendar-sync", { cache: "no-store" });
      const data = await response.json();
      setShifts(current => {
        const manualOrDinii = current.filter(shift => !shift.googleEventId);
        const google = data.shifts.map((shift: Shift) => {
          const existing = current.find(item => item.googleEventId === shift.googleEventId || (item.title === shift.title && item.month === shift.month && item.day === shift.day));
          return existing ? { ...shift, id: existing.id, start: existing.start, end: existing.end } : shift;
        });
        return [...manualOrDinii, ...google];
      });
      setSyncedAt(new Date(data.syncedAt).toLocaleString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }));
      setSyncStatus("自動同期 ON");
    } catch {
      setSyncStatus("同期エラー");
    }
  };

  const syncDinii = async () => {
    setDiniiStatus("同期中");
    try {
      const response = await fetch("/api/dinii-sync", { cache: "no-store" });
      const data = await response.json();
      setShifts(current => {
        const withoutSameSource = current.filter(shift => !shift.dinniiShiftId);
        const merged = data.shifts.map((shift: Shift) => {
          const existing = current.find(item => item.dinniiShiftId === shift.dinniiShiftId);
          return existing ? { ...shift, id: existing.id, start: existing.start, end: existing.end } : shift;
        });
        return [...withoutSameSource, ...merged];
      });
      setDiniiSyncedAt(new Date(data.syncedAt).toLocaleString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }));
      setDiniiStatus("自動読み取り可");
    } catch {
      setDiniiStatus("同期エラー");
    }
  };

  useEffect(() => {
    syncCalendar();
    syncDinii();
    const timer = window.setInterval(syncCalendar, 15 * 60 * 1000);
    const dinniTimer = window.setInterval(syncDinii, 30 * 60 * 1000);
    return () => {
      window.clearInterval(timer);
      window.clearInterval(dinniTimer);
    };
  }, []);

  const incomeRowTotals = incomeRows.map(row => ({ ...row, total: row.values.reduce((sum, value) => sum + value, 0) }));
  const monthlyTotals = monthly.map(([,], index) => incomeRows.reduce((sum, row) => sum + (row.values[index] ?? 0), 0));
  const bankTotal = incomeRowTotals.filter(row => !row.cash).reduce((sum, row) => sum + row.total, 0);
  const cashTotal = incomeRowTotals.filter(row => row.cash).reduce((sum, row) => sum + row.total, 0);
  const allTotal = bankTotal + cashTotal;
  const limit = 1230000;
  const remaining = limit - bankTotal;
  const progress = Math.round(bankTotal / limit * 100);
  const monthShifts = shifts.filter(event => event.month === calendarMonth);
  const firstWeekday = new Date(2026, calendarMonth, 1).getDay();
  const daysInMonth = new Date(2026, calendarMonth + 1, 0).getDate();
  const selectedShift = shifts.find(shift => shift.id === selectedShiftId) ?? monthShifts[0] ?? shifts[0];
  const selectedJob = jobs.find(job => job.name === selectedShift.source);
  const selectedPay = calculatePay(selectedShift, selectedJob?.hourlyWage ?? 0);
  const monthPlanned = useMemo(() => monthShifts.reduce((totals, shift) => {
    const job = jobs.find(item => item.name === shift.source);
    const amount = calculatePay(shift, job?.hourlyWage ?? 0).total;
    if (job?.payment === "手渡し") totals.cash += amount;
    else totals.bank += amount;
    if (!job?.hourlyWage) totals.unset += 1;
    totals.minutes += calculatePay(shift, job?.hourlyWage ?? 0).minutes;
    return totals;
  }, { bank: 0, cash: 0, unset: 0, minutes: 0 }), [jobs, monthShifts]);

  const updateJob = (jobId: number, patch: Partial<Job>) => {
    setJobs(items => items.map(job => job.id === jobId ? { ...job, ...patch } : job));
  };
  const updateShift = (shiftId: number, patch: Partial<Shift>) => {
    setShifts(items => items.map(shift => shift.id === shiftId ? { ...shift, ...patch } : shift));
  };
  const updateIncome = (rowIndex: number, monthIndex: number, value: number) => {
    setIncomeRows(rows => rows.map((row, index) => index === rowIndex ? {
      ...row,
      values: row.values.map((amount, valueIndex) => valueIndex === monthIndex ? value : amount),
    } : row));
  };
  const addJob = (form: FormData) => {
    const name = String(form.get("name") || "").trim();
    if (!name) return;
    const payment = String(form.get("payment")) === "手渡し" ? "手渡し" : "振込";
    setJobs(items => [...items, {
      id: Date.now(),
      name,
      kind: String(form.get("kind") || "アルバイト"),
      hourlyWage: Number(form.get("hourlyWage") || 0),
      transport: "",
      overtimeNote: "自動計算",
      payment,
      dependent: payment === "振込",
      total: 0,
      color: "#2563eb",
    }]);
    setShowNewJob(false);
  };
  const addShift = (form: FormData) => {
    const source = String(form.get("source") || jobs[0]?.name || "アルバイト");
    const day = Number(form.get("day") || 1);
    const start = String(form.get("start") || "09:00");
    const end = String(form.get("end") || "17:00");
    const title = String(form.get("title") || `${source}（手入力）`);
    const next: Shift = { id: Date.now(), month: calendarMonth, day, title, source, start, end, colorId: "10" };
    setShifts(items => [...items, next]);
    setSelectedShiftId(next.id);
    setShowNewShift(false);
  };
  const addTimeyCase = (form: FormData) => {
    const name = String(form.get("name") || "").trim();
    if (!name) return;
    setTimeyCases(items => [...items, {
      id: Date.now(),
      name,
      hours: String(form.get("hours") || "").trim(),
      amount: Number(form.get("amount") || 0),
    }]);
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span>¥</span> IncomeMate</div>
        <nav>
          <button className={view === "home" ? "active" : ""} onClick={() => setView("home")}><span>⌂</span> ホーム</button>
          <button className={view === "calendar" ? "active" : ""} onClick={() => setView("calendar")}><span>□</span> カレンダー</button>
          <button className={view === "jobs" ? "active" : ""} onClick={() => setView("jobs")}><span>▣</span> アルバイト詳細</button>
        </nav>
        <div className="job-list">
          <p>アルバイト</p>
          {jobs.map((job) => <div key={job.id}><i style={{ background: job.color }} /><span>{job.name}</span><small>{job.hourlyWage ? `${yen(job.hourlyWage)} / 時` : "時給未設定"}</small></div>)}
        </div>
        <div className="side-account">
          <span>{user.displayName.slice(0, 1).toUpperCase()}</span>
          <div><strong>{user.displayName}</strong><small>{user.email}</small></div>
          <a aria-label="ログアウト" href={logoutUrl}>↪</a>
        </div>
      </aside>

      <section className="content">
        {view === "home" && <>
          <header>
            <div><p className="eyebrow">2026年 7月26日</p><h1>収入サマリー</h1><p>今月までの収入と、扶養上限までの残りを確認できます。</p></div>
            <button className="primary" onClick={() => setView("calendar")}>カレンダーを見る</button>
          </header>

          <section className="hero-card">
            <div>
              <p>扶養上限に入る収入</p>
              <strong>{yen(bankTotal)}</strong>
              <span>今年あと <b>{yen(remaining)}</b> まで働けます</span>
            </div>
            <div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}><span>{progress}<small>%</small></span></div>
            <div className="hero-detail"><span>記録している収入</span><strong>{yen(allTotal)}</strong><small>手渡しも含めた合計</small></div>
          </section>

          <section className="metrics">
            <article><div className="metric-icon blue">振</div><div><p>振込でもらった分</p><strong>{yen(bankTotal)}</strong><small>扶養上限に入る金額</small></div></article>
            <article><div className="metric-icon orange">手</div><div><p>手渡しでもらった分</p><strong>{yen(cashTotal)}</strong><small>メモとして残す金額</small></div></article>
            <article><div className="metric-icon green">予</div><div><p>{monthNames[calendarMonth]}の予定</p><strong>{yen(monthPlanned.bank + monthPlanned.cash)}</strong><small>登録済みシフトから計算</small></div></article>
          </section>

          <section className="panel">
            <div className="panel-head"><div><h2>月ごとの収入</h2><p>金額はここで直接直せます。</p></div><span className="source-badge">編集できます</span></div>
            <div className="income-matrix-wrap">
              <table className="income-matrix">
                <thead><tr><th>バイト先・種類</th>{monthly.map(([month]) => <th key={month}>{month}</th>)}<th>合計</th></tr></thead>
                <tbody>
                  {incomeRows.map(row => <tr key={row.name}>
                    <td><strong>{row.name}</strong>{row.cash && <small>手渡し</small>}</td>
                    {row.values.map((value, index) => <td key={index}><input className="money-input" type="number" value={value || ""} placeholder="—" onChange={(event) => updateIncome(incomeRows.indexOf(row), index, Number(event.target.value))} /></td>)}
                    <td><strong>{yen(row.values.reduce((sum, value) => sum + value, 0))}</strong></td>
                  </tr>)}
                  <tr className="total-row"><td><strong>全部の合計</strong></td>{monthlyTotals.map((amount, index) => <td key={index}><strong>{yen(amount)}</strong></td>)}<td><strong>{yen(allTotal)}</strong></td></tr>
                </tbody>
              </table>
            </div>
          </section>
          <div className="info-note"><b>使い方</b><span>実際にもらった金額と違うときは、表の数字をそのまま書き換えてください。</span></div>
        </>}

        {view === "jobs" && <>
          <header>
            <div><p className="eyebrow">WORK PROFILES</p><h1>アルバイト詳細</h1><p>バイト先ごとの条件を登録します。タイミーは案件履歴で管理します。</p></div>
            <button className="primary" onClick={() => setShowNewJob(true)}>新規アルバイト</button>
          </header>
          <section className="job-detail-grid">
            {jobs.map((job) => <article className="job-detail-card" key={job.id}>
              <div className="job-detail-head"><i style={{ background: job.color }} /><div><h2>{job.name}</h2><p>{job.kind}</p></div><span className={job.dependent ? "included" : "excluded"}>{job.dependent ? "扶養対象" : "扶養対象外"}</span></div>
              <dl>
                {job.name === "タイミー" ? <>
                  <div className="wide"><dt>管理方法</dt><dd>案件履歴で管理</dd></div>
                  <div className="wide"><dt>登録内容</dt><dd>仕事の名前・働いた時間・もらえる総額</dd></div>
                </> : <>
                  <div><dt>時給</dt><dd><input className="inline-edit-input" type="number" min="0" value={job.hourlyWage || ""} placeholder="未設定" onChange={(event) => updateJob(job.id, { hourlyWage: Number(event.target.value) })} /></dd></div>
                  <div><dt>交通費</dt><dd><input className="inline-edit-input" value={job.transport} placeholder="収入とは別なので未記入" onChange={(event) => updateJob(job.id, { transport: event.target.value })} /></dd></div>
                  <div><dt>残業・深夜</dt><dd><input className="inline-edit-input" value={job.overtimeNote} onChange={(event) => updateJob(job.id, { overtimeNote: event.target.value })} /></dd></div>
                </>}
                <div><dt>支払方法</dt><dd><select className="inline-edit-select" value={job.payment} onChange={(event) => updateJob(job.id, { payment: event.target.value as Payment, dependent: event.target.value === "振込" })}><option value="振込">振込</option><option value="手渡し">手渡し</option></select></dd></div>
              </dl>
              <footer><span>2026年累計</span><strong>{yen(job.total)}</strong></footer>
            </article>)}
          </section>
          <div className="info-note"><b>給料計算</b><span>時給のバイトは、働いた時間から自動で計算します。タイミーは案件ごとの総額で記録します。</span></div>
          <section className="integration-panel">
            <div className="panel-head"><div><h2>タイミー案件履歴</h2><p>また同じ仕事を入れるときに見返せます。</p></div></div>
            <div className="timey-form">
              <form onSubmit={(event) => { event.preventDefault(); addTimeyCase(new FormData(event.currentTarget)); event.currentTarget.reset(); }}>
                <input name="name" placeholder="仕事の名前" />
                <input name="hours" placeholder="働いた時間" />
                <input name="amount" type="number" placeholder="もらえる総額" />
                <button className="mini-action">保存</button>
              </form>
              <div className="timey-list">
                {timeyCases.map(item => <div key={item.id}><strong>{item.name}</strong><span>{item.hours || "時間未入力"}・{yen(item.amount)}</span></div>)}
              </div>
            </div>
          </section>
          <section className="integration-panel">
            <div className="panel-head"><div><h2>シフトの取り込み</h2><p>外部サービスの予定を、このアプリにまとめます。</p></div></div>
            <div className="integration-grid">
              <article><strong>Dinii</strong><span>WILDBEACH川口の確定シフトを「わいび」として取り込みます。{diniiSyncedAt && ` 最終: ${diniiSyncedAt}`}</span><button className="mini-action" onClick={syncDinii}>取り込み</button></article>
              <article><strong>Googleカレンダー</strong><span>緑色の予定をアルバイト予定として読み込みます。</span></article>
              <article><strong>ファイル</strong><span>CSVやExcelのシフト表にも対応できます。</span></article>
              <article><strong>メール</strong><span>シフト通知メールから日時を読み取れるようにできます。</span></article>
              <article><strong>Supabase</strong><span>{cloudStatus}{cloudSyncedAt && ` 最終: ${cloudSyncedAt}`}。スマホとPCで同じデータを使うためのクラウド保存です。</span></article>
            </div>
          </section>
        </>}

        {view === "calendar" && <>
          <header><div><p className="eyebrow">CALENDAR</p><h1>アルバイトカレンダー</h1><p>予定を確認して、終わったあとに時間や勤務先を直せます。</p></div><span className="sync-status"><i /> {syncStatus}</span></header>
          <section className="sync-strip">
            <div><strong>予定の取り込み</strong><span>Googleカレンダーの緑色予定を読み込みます。{syncedAt && ` 最終: ${syncedAt}`}</span></div>
            <div className="sync-actions"><button className="ghost" onClick={syncCalendar}>今すぐ同期</button><button className="primary" onClick={() => setShowNewShift(true)}>予定追加</button></div>
          </section>
          <section className="calendar-layout">
            <div className="calendar-panel">
              <div className="calendar-head">
                <button aria-label="前の月" onClick={() => setCalendarMonth(month => month === 0 ? 11 : month - 1)}>‹</button>
                <h2>2026年 {monthNames[calendarMonth]}</h2>
                <button aria-label="次の月" onClick={() => setCalendarMonth(month => month === 11 ? 0 : month + 1)}>›</button>
              </div>
              <div className="weekdays">{weekdays.map(d => <span key={d}>{d}</span>)}</div>
              <div className="calendar-grid">
                {Array.from({length: 42}, (_, index) => {
                  const day = index - firstWeekday + 1;
                  const events = monthShifts.filter(item => item.day === day);
                  return <div className={`calendar-day ${calendarMonth === 6 && day === 26 ? "today" : ""} ${day < 1 || day > daysInMonth ? "outside" : ""}`} key={index}>
                    {day > 0 && day <= daysInMonth && <><b>{day}</b>{events.map(event => <button className="green-event" key={event.id} onClick={() => setSelectedShiftId(event.id)}><span>{event.start}–{event.end}</span>{event.title}</button>)}</>}
                  </div>;
                })}
              </div>
            </div>
            <aside className="event-detail">
              <p className="eyebrow">選択中の勤務</p>
              <span className="event-dot" />
              <h2>{selectedShift.title}</h2>
              <p>{monthNames[selectedShift.month]}{selectedShift.day}日</p>
              <label className="event-edit-field">タイトル<input value={selectedShift.title} onChange={(event) => updateShift(selectedShift.id, { title: event.target.value })} /></label>
              <label className="event-edit-field">勤務先<select value={selectedShift.source} onChange={(event) => updateShift(selectedShift.id, { source: event.target.value })}>{jobs.map(job => <option key={job.id} value={job.name}>{job.name}</option>)}</select></label>
              <label className="event-edit-field">日付<input type="number" min="1" max={daysInMonth} value={selectedShift.day} onChange={(event) => updateShift(selectedShift.id, { day: Number(event.target.value) })} /></label>
              <div className="time-edit-row"><label>開始<input type="time" value={selectedShift.start} onChange={(event) => updateShift(selectedShift.id, { start: event.target.value })} /></label><label>終了<input type="time" value={selectedShift.end} onChange={(event) => updateShift(selectedShift.id, { end: event.target.value })} /></label></div>
              <dl>
                <div><dt>勤務種類</dt><dd>{selectedShift.source}</dd></div>
                <div><dt>支払い方法</dt><dd>{selectedJob?.payment ?? "未設定"}</dd></div>
                <div><dt>勤務時間</dt><dd>{Math.floor(selectedPay.minutes / 60)}時間{selectedPay.minutes % 60}分</dd></div>
                <div><dt>予定収入</dt><dd>{selectedJob?.hourlyWage ? yen(selectedPay.total) : "時給未設定"}</dd></div>
                <div><dt>割増内訳</dt><dd>{selectedPay.overtime + selectedPay.night + selectedPay.doublePremium ? "割増あり" : "通常のみ"}</dd></div>
              </dl>
              <small>バイト終了後はここで開始・終了時間を直すと、給与見込みも更新されます。</small>
            </aside>
          </section>
          <section className="planned-income-panel">
            <div className="planned-income-head">
              <div><p className="eyebrow">PLANNED INCOME</p><h2>{monthNames[calendarMonth]}の収入見込み</h2></div>
              <span>登録済み予定</span>
            </div>
            <div className="planned-income-grid">
              <article><small>振込</small><strong>{yen(monthPlanned.bank)}</strong><p>扶養上限に入る予定額</p></article>
              <article><small>手渡し</small><strong>{yen(monthPlanned.cash)}</strong><p>記録として残す予定額</p></article>
              <article><small>合計</small><strong>{yen(monthPlanned.bank + monthPlanned.cash)}</strong><p>{monthPlanned.unset ? `${monthPlanned.unset}件は金額未設定` : "入力済み"}</p></article>
            </div>
          </section>
          <div className="calendar-summary"><div><strong>{monthShifts.length}</strong><span>{monthNames[calendarMonth]}の緑色予定</span></div><div><strong>{Math.floor(monthPlanned.minutes / 60)}時間{monthPlanned.minutes % 60}分</strong><span>勤務時間合計</span></div><div><strong>自動同期</strong><span>Google Calendar 緑色のみ</span></div></div>
        </>}
      </section>

      {showNewJob && <div className="modal-backdrop">
        <form className="modal" onSubmit={(event) => {
          event.preventDefault();
          addJob(new FormData(event.currentTarget));
        }}>
          <div className="modal-head"><h2>新規アルバイト</h2><button type="button" onClick={() => setShowNewJob(false)}>×</button></div>
          <div className="form-grid">
            <label className="field"><span>名前</span><input name="name" required placeholder="例：カフェ" /></label>
            <label className="field"><span>種類</span><input name="kind" placeholder="例：固定アルバイト" /></label>
            <label className="field"><span>時給</span><input name="hourlyWage" type="number" min="0" placeholder="1200" /></label>
            <label className="field"><span>支払方法</span><select name="payment"><option>振込</option><option>手渡し</option></select></label>
          </div>
          <div className="modal-actions"><button className="ghost" type="button" onClick={() => setShowNewJob(false)}>キャンセル</button><button className="primary">登録</button></div>
        </form>
      </div>}
      {showNewShift && <div className="modal-backdrop">
        <form className="modal" onSubmit={(event) => {
          event.preventDefault();
          addShift(new FormData(event.currentTarget));
        }}>
          <div className="modal-head"><h2>予定を追加</h2><button type="button" onClick={() => setShowNewShift(false)}>×</button></div>
          <div className="form-grid">
            <label className="field"><span>タイトル</span><input name="title" placeholder="例：そばや（手入力）" /></label>
            <label className="field"><span>勤務先</span><select name="source">{jobs.map(job => <option key={job.id} value={job.name}>{job.name}</option>)}</select></label>
            <label className="field"><span>日付</span><input name="day" type="number" min="1" max={daysInMonth} defaultValue={new Date().getDate()} /></label>
            <label className="field"><span>開始</span><input name="start" type="time" defaultValue="09:00" /></label>
            <label className="field"><span>終了</span><input name="end" type="time" defaultValue="17:00" /></label>
          </div>
          <div className="modal-actions"><button className="ghost" type="button" onClick={() => setShowNewShift(false)}>キャンセル</button><button className="primary">追加</button></div>
        </form>
      </div>}
    </main>
  );
}
