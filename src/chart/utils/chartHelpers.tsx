import { Datum, Serie } from "@nivo/line";
import { DateData, DeltaData } from "../chart.types";

export const formatDataForNivo = function(data: DateData[], deltaData: boolean = false): Serie[] {
  if (data == undefined || data.length == 0) return [];

  interface TempDict {
    [key: string]: Datum[];
  }

  // get dict of all countries from first item in list
  let tDict: TempDict = {};
  data[0].regionData.forEach(regionData => {
    tDict[regionData.co] = [];
  });

  // iterate through dates, add data to dict of countries
  data.forEach((dd, dateIdx) => {
    dd.regionData.forEach((rd, regIdx) => {
      const casesPrevDay = dateIdx > 0 ? data[dateIdx - 1].regionData[regIdx].n : 0;
      tDict[rd.co].push({
        x: new Date(Date.parse(dd.date)),
        y: deltaData ? rd.n - casesPrevDay : rd.n,
        cases: rd.n,
        delta: rd.n - casesPrevDay,
      });
    });
  });

  let nivoData = [];
  for (const country in tDict) {
    nivoData.push({
      id: country,
      data: tDict[country],
    });
  }

  return nivoData;
};

// returns country and most recent delta of cases sorted (most recent day - previous day) - largest first
export const getDeltaData = function(data: DateData[]): DeltaData[] {
  if (data == undefined || data.length == 0) return [];

  const casesDelta = data[data.length - 1].regionData.map((rd, idx) => ({
    country: rd.co,
    cases: rd.n,
    delta: rd.n - data[data.length - 2].regionData[idx].n,
  }));
  return casesDelta;
};

export const sortDataByDelta = function(data: DeltaData[]): DeltaData[] {
  return data.sort((a, b) => b.delta - a.delta);
}

export const sortDataByCases = function(data: DeltaData[]): DeltaData[] {
  return data.sort((a, b) => (b.cases - a.cases))
}

// getLastNDaysData returns last n days of data
export const getLastNDaysData = function(serie: Serie[], nDays: number): Serie[] {
  if (serie == undefined || serie.length == 0) return [];

  const resData = serie.map(v => {
    const tData = v.data.slice(Math.max(v.data.length - nDays, 0));
    return {
      id: v.id,
      data: tData,
    };
  });
  return resData;
};

// returns 2020-03-04 as 03-04
export const formatDateString = function(date: string | number | Date) {
  let dateString = date;
  if (date instanceof Date) {
    dateString = date.toISOString().split("T")[0];
  }
  return dateString
    .toString()
    .split("-")
    .slice(1)
    .join("-");
};
