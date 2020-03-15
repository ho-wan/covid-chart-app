import { Serie } from "@nivo/line";
import { DateData } from "../chart.types";

export const formatDataForNivo = function(data: DateData[]): Serie[] {
  if (!data || data.length == 0) return [];

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
