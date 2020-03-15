import { Serie } from "@nivo/line";
import { DateData, DeltaData } from "../chart.types";

export const formatDataForNivo = function(data: DateData[]): Serie[] {
  if (data == undefined || data.length == 0) return [];

  interface TempDict {
    [key: string]: DataPoint[];
  }

  interface DataPoint {
    x: string;
    y: number;
  }

  // get dict of all countries from first item in list
  let tDict: TempDict = {};
  data[0].regionData.forEach(regionData => {
    tDict[regionData.co] = [];
  });

  // iterate through dates, add data to dict of countries
  data.forEach(dd => {
    dd.regionData.forEach(rd => {
      tDict[rd.co].push({
        x: dd.date,
        y: rd.n,
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
export const getMostRecentDelta = function(data: DateData[]): DeltaData[] {
  if (data == undefined || data.length == 0) return [];

  const casesDelta = data[data.length - 1].regionData.map((rd, idx) => ({
    country: rd.co,
    cases: rd.n,
    delta: rd.n - data[data.length - 2].regionData[idx].n,
  }));
  casesDelta.sort((a, b) => b.delta - a.delta);
  return casesDelta;
};
