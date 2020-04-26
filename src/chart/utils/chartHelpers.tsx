import { Datum, Serie } from "@nivo/line";
import { DateData, DeltaData } from "../chart.types";
import { ShowDelta } from "../ChartCard";

export const formatDataForNivo = function(data: DateData[]): Serie[] {
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
      const lastIdx = dateIdx - 1;
      const casesPrevDay = dateIdx > 0 ? data[lastIdx].regionData[regIdx].n : 0;
      const curDelta = dateIdx > 0 ? rd.n - casesPrevDay : 0;
      const deltaPrevDay = dateIdx > 0 ? tDict[rd.co][lastIdx].delta : 0;

      tDict[rd.co].push({
        x: new Date(Date.parse(dd.date)),
        // set min to 1 for log graph
        cases: Math.max(rd.n, 1),
        delta: Math.max(curDelta, 1),
        dDelta: curDelta - deltaPrevDay,
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
};

export const sortDataByCases = function(data: DeltaData[]): DeltaData[] {
  return data.sort((a, b) => b.cases - a.cases);
};

// add Y value for data based on state
export const getYValueForData = function(data: Serie[], showDelta: ShowDelta) {
  const resData = data.map(country => ({
    id: country.id,
    data: country.data.map(d => {
      if (showDelta == "delta") {
        d.y = d.delta;
      } else if (showDelta == "dDelta") {
        d.y = d.dDelta;
      } else {
        d.y = d.cases;
      }
      return d;
    }),
  }));
  return resData;
};

// Simple moving average
export const SMACalc = function(mArray: number[], mRange: number) {
  let sum = mArray[0];
  let smaArray = [sum];
  for (let i = 1, n = mArray.length; i < n; i++) {
    let av;
    if (i < mRange) {
      sum += mArray[i];
      av = sum / (i + 1);
    } else {
      sum += mArray[i] - mArray[i - mRange];
      av = sum / mRange;
    }
    smaArray.push(av);
  }
  return smaArray;
};

// Exponential moving average: source https://stackoverflow.com/questions/40057020/calculating-exponential-moving-average-ema-using-javascript
export const EMACalc = function(mArray: number[], mRange: number) {
  let k = 2 / (mRange + 1);
  // first item is just the same as the first item in the input
  let emaArray = [mArray[0]];
  // for the rest of the items, they are computed with the previous one
  for (let i = 1; i < mArray.length; i++) {
    emaArray.push(mArray[i] * k + emaArray[i - 1] * (1 - k));
  }
  return emaArray;
};

export const getMovingAverage = function(data: Serie[], movingAvDays: number) {
  const resData = data.map(country => {
    const mavData = SMACalc(
      country.data.map(d => Number(d.y)),
      movingAvDays
    );
    return {
      id: country.id,
      data: country.data.map((d, idx) => {
        d.y = mavData[idx];
        return d;
      }),
    };
  });
  return resData;
};

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

export const tickSpacing: { [key: number]: string } = {
  7: "1",
  14: "2",
  28: "4",
  56: "8",
};

export interface StateForData {
  countriesPage: number;
  dateRange: number;
  movingAvDays: number;
  nCountries: number;
  showDelta: ShowDelta;
}

// format data to display in chart
export const getFormattedData = function(
  dateData: DateData[],
  { countriesPage, showDelta, dateRange, nCountries, movingAvDays }: StateForData
) {
  const nivoData = formatDataForNivo(dateData);

  // array of the top nCountries with largest increase in cases
  const dataWithDelta = getDeltaData(dateData);

  // sort by delta or cases
  const orderedData = showDelta == "total" ? sortDataByCases(dataWithDelta) : sortDataByDelta(dataWithDelta);

  // get list of names for the top N number of countries - TODO use UID instead of string
  const startIdx = (countriesPage - 1) * nCountries;
  let orderedCountries = orderedData.slice(startIdx, startIdx + nCountries).map(dd => dd.country);

  // add countries in order of delta - TODO can make this more efficient using a hash
  const filteredData: Serie[] = [];
  orderedCountries.forEach(co => {
    nivoData.forEach(s => {
      if (s.id.toString() === co) {
        filteredData.push(s);
      }
    });
  });

  let data = getYValueForData(filteredData, showDelta);

  data = getMovingAverage(data, movingAvDays);

  // reverse to show legend in correcy order
  data = getLastNDaysData(filteredData, dateRange).reverse();
  return data;
};
