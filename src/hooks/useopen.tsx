import { useState, useEffect, useRef } from "react";

export interface InstrumentData {
  time: string;
  timestamp: string;
  currentPrice: string;
  "24h_high": string;
  "24h_low": string;
  "24h_change": string;
  tradingPair: string;
}
export interface PairData {
  id: number;
  name: string;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  instruments: InstrumentData[];
}
export interface WebSocketMessage {
  [pair: string]: PairData;
}

type MarketKind = "crypto" | "forex" | "commodities" | "stocks" | "indices";

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
};
const dayMinute = (d: Date) => d.getUTCHours() * 60 + d.getUTCMinutes();
const weekMinute = (d: Date) =>
  d.getUTCDay() * 1440 + d.getUTCHours() * 60 + d.getUTCMinutes();
const addMinutes = (d: Date, mins: number) => new Date(d.getTime() + mins * 60000);
const startOfUTCDay = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
const startOfUTCWeek = (d: Date) => {
  const sod = startOfUTCDay(d);
  const dow = sod.getUTCDay(); // 0=Sun
  return addMinutes(sod, -dow * 1440);
};

export const getMarketKindFromId = (id: number): MarketKind | null => {
  if (id >= 0 && id < 1000) return "crypto";
  if (id >= 5000 && id < 5100) return "forex";
  if (id >= 5500 && id < 5600) return "commodities";
  if (id >= 6000 && id < 6100) return "stocks";
  if (id >= 6100 && id < 6200) return "indices";
  return null;
};

export interface MarketSchedule {
  kind: MarketKind;
  alwaysOpen?: boolean;
  dailyWindowsUTC?: { [day: number]: Array<[number, number]> }; // 0=Sun..6=Sat, minutes
  weeklyWindowsUTC?: Array<[number, number]>; // minutes since Sun 00:00
}

/** Règles (UTC) */
export const getMarketScheduleUTC = (kind: MarketKind): MarketSchedule => {
  switch (kind) {
    case "crypto":
      return { kind, alwaysOpen: true };
    case "forex":
      // Sun 22:00 → Fri 21:00 (continu)
      return {
        kind,
        weeklyWindowsUTC: [[0 * 1440 + toMinutes("22:00"), 5 * 1440 + toMinutes("21:00")]],
      };
    case "commodities":
      // Sun 23:00 → Fri 22:00 ; pause journalière 22:00–23:00
      return {
        kind,
        weeklyWindowsUTC: [[0 * 1440 + toMinutes("23:00"), 5 * 1440 + toMinutes("22:00")]],
        dailyWindowsUTC: {
          0: [], // Sun (ouvre via weekly à 23:00)
          1: [[toMinutes("00:00"), toMinutes("22:00")]],
          2: [[toMinutes("00:00"), toMinutes("22:00")]],
          3: [[toMinutes("00:00"), toMinutes("22:00")]],
          4: [[toMinutes("00:00"), toMinutes("22:00")]],
          5: [[toMinutes("00:00"), toMinutes("22:00")]],
          6: [], // Sat
        },
      };
    case "stocks":
      // Mon–Fri 14:30–21:00
      return {
        kind,
        dailyWindowsUTC: {
          0: [],
          1: [[toMinutes("14:30"), toMinutes("21:00")]],
          2: [[toMinutes("14:30"), toMinutes("21:00")]],
          3: [[toMinutes("14:30"), toMinutes("21:00")]],
          4: [[toMinutes("14:30"), toMinutes("21:00")]],
          5: [[toMinutes("14:30"), toMinutes("21:00")]],
          6: [],
        },
      };
    case "indices":
      // Sun 23:00 → Fri 22:00 ; pause journalière 22:00–23:00
      return {
        kind,
        weeklyWindowsUTC: [[0 * 1440 + toMinutes("23:00"), 5 * 1440 + toMinutes("22:00")]],
        dailyWindowsUTC: {
          0: [],
          1: [[toMinutes("00:00"), toMinutes("22:00")]],
          2: [[toMinutes("00:00"), toMinutes("22:00")]],
          3: [[toMinutes("00:00"), toMinutes("22:00")]],
          4: [[toMinutes("00:00"), toMinutes("22:00")]],
          5: [[toMinutes("00:00"), toMinutes("22:00")]],
          6: [],
        },
      };
  }
};

/** Intersections helper */
const intersect = (a: [number, number], b: [number, number]): [number, number] | null => {
  const s = Math.max(a[0], b[0]);
  const e = Math.min(a[1], b[1]);
  return s < e ? [s, e] : null;
};

/** Génère des intervalles d’ouverture (Date UTC) pour les N prochains jours */
const buildOpenIntervals = (kind: MarketKind, from: Date, daysAhead = 8): Array<[Date, Date]> => {
  const sched = getMarketScheduleUTC(kind);
  if (sched.alwaysOpen) {
    const start = startOfUTCDay(from);
    return [[start, addMinutes(start, daysAhead * 1440)]];
  }

  const out: Array<[Date, Date]> = [];
  const weekStart = startOfUTCWeek(from);

  // Préparer weekly windows (en minutes depuis weekStart)
  const weekly: Array<[number, number]> =
    sched.weeklyWindowsUTC?.map(w => w) ?? [[0, 7 * 1440]]; // si pas de weekly, tout le temps

  for (let d = 0; d < daysAhead; d++) {
    const dayDate = addMinutes(startOfUTCDay(from), d * 1440);
    const weekday = dayDate.getUTCDay();
    const baseDayRanges: Array<[number, number]> =
      sched.dailyWindowsUTC
        ? (sched.dailyWindowsUTC[weekday] || []).map(([s, e]) => [d * 1440 + s, d * 1440 + e] as [number, number])
        : [[d * 1440 + 0, d * 1440 + 1440]]; // si pas de daily: 24h

    // Intersecter chaque baseDayRange avec weekly windows étendues sur l’horizon
    for (const [ds, de] of baseDayRanges) {
      for (const [ws, we] of weekly) {
        const iv = intersect([ds, de], [ws, we]);
        if (iv) {
          const absStart = addMinutes(weekStart, iv[0]); // Date
          const absEnd = addMinutes(weekStart, iv[1]);
          out.push([absStart, absEnd]);
        }
      }
    }
  }
  // Trier au cas où
  out.sort((a, b) => a[0].getTime() - b[0].getTime());
  return out;
};

export interface MarketStatus {
  isOpen: boolean;
  nextOpen: Date | null;
  timeUntilOpenMs?: number;
  timeUntilCloseMs?: number;
}

/** Renvoie statut + prochaine ouverture/fermeture (UTC) */
export const getMarketStatusUTC = (kind: MarketKind, at: Date = new Date()): MarketStatus => {
  const intervals = buildOpenIntervals(kind, at, 8);
  const now = at.getTime();

  for (const [start, end] of intervals) {
    const s = start.getTime();
    const e = end.getTime();
    if (now >= s && now < e) {
      return {
        isOpen: true,
        nextOpen: null,
        timeUntilCloseMs: e - now,
      };
    }
    if (now < s) {
      return {
        isOpen: false,
        nextOpen: start,
        timeUntilOpenMs: s - now,
      };
    }
  }
  // Si rien trouvé (très rare), recommencer semaine suivante
  const nextWeek = addMinutes(startOfUTCDay(at), 7 * 1440);
  const again = buildOpenIntervals(kind, nextWeek, 8);
  if (again.length) {
    const [start] = again[0];
    return {
      isOpen: false,
      nextOpen: start,
      timeUntilOpenMs: start.getTime() - now,
    };
  }
  return { isOpen: false, nextOpen: null };
};

/** Hook WS identique + enrichi si besoin */
export const useWebSocket = () => {
  const [data, setData] = useState<WebSocketMessage>({});
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const connect = () => {
      try {
        const ws = new WebSocket("wss://backend.brokex.trade/ws/prices");
        ws.onopen = () => setConnected(true);
        ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            setData(message);
          } catch (e) {
            console.error("WS parse error:", e);
          }
        };
        ws.onerror = (e) => console.error("WS error:", e);
        ws.onclose = () => {
          setConnected(false);
          reconnectRef.current = setTimeout(connect, 3000);
        };
        wsRef.current = ws;
      } catch (e) {
        console.error("WS create error:", e);
        reconnectRef.current = setTimeout(connect, 3000);
      }
    };
    connect();
    return () => {
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      wsRef.current?.close();
    };
  }, []);

  return { data, connected };
};

export const getAssetsByCategory = (data: WebSocketMessage) => {
  const assets = Object.entries(data)
    .filter(([, p]) => p?.instruments?.length > 0)
    .map(([pair, p]) => {
      const kind = getMarketKindFromId(p.id);
      const symbol = pair.toUpperCase().replace("_", "/");
      const price = p.instruments[0]?.currentPrice ?? "0";
      const chg = p.instruments[0]?.["24h_change"] ?? "0";
      const status = kind ? getMarketStatusUTC(kind) : { isOpen: false, nextOpen: null };

      return {
        id: p.id,
        name: p.name,
        symbol,
        pair,
        currentPrice: price,
        change24h: chg,
        kind,
        marketOpenUTC: status.isOpen,
        nextOpenUTC: status.nextOpen?.toISOString() ?? null,
        timeUntilOpenMs: status.timeUntilOpenMs ?? null,
        timeUntilCloseMs: status.timeUntilCloseMs ?? null,
      };
    });

  return {
    crypto: assets.filter((a) => a.id >= 0 && a.id < 1000),
    forex: assets.filter((a) => a.id >= 5000 && a.id < 5100),
    commodities: assets.filter((a) => a.id >= 5500 && a.id < 5600),
    stocks: assets.filter((a) => a.id >= 6000 && a.id < 6100),
    indices: assets.filter((a) => a.id >= 6100 && a.id < 6200),
  };
};

/** (optionnel) label lisible */
export const getReadableHoursUTC = (kind: MarketKind): string => {
  switch (kind) {
    case "crypto":
      return "24/7 (UTC)";
    case "forex":
      return "Sun 22:00 → Fri 21:00 UTC (continu)";
    case "commodities":
      return "Sun 23:00 → Fri 22:00 UTC ; pause 22:00–23:00 chaque jour";
    case "stocks":
      return "Mon–Fri 14:30–21:00 UTC";
    case "indices":
      return "Sun 23:00 → Fri 22:00 UTC ; pause 22:00–23:00 chaque jour";
  }
};
