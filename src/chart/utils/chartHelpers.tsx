import { Serie } from "@nivo/line";
import { DateData } from "../chart.types";

const tempData: Serie[] = [
  {
    id: "Japan",
    data: [
      {
        x: "2020-03-06",
        y: 420,
      },
      {
        x: "2020-03-05",
        y: 360,
      },
    ],
  },
  {
    id: "China",
    data: [
      {
        x: "2020-03-06",
        y: 900,
      },
      {
        x: "2020-03-05",
        y: 800,
      },
    ],
  },
];

export const formatDataForNivo = function(data: DateData[]) {
  return tempData;
};

/*
export const flattenDataForRecharts = function(data: DateData[]) {
  const dataKeySet: Set<string> = new Set();
  const dataFlattened = data.map(d => {
    // sum up cases by country and store in temp dict
    const dict: FlatCountryCase = {};
    d.regionData.forEach(rd => {
      if (dict[rd.country] == null) {
        dict[rd.country] = rd.cases;
      } else {
        dict[rd.country] += rd.cases;
      }

      dataKeySet.add(rd.country);
    });

    return {
      ...dict,
      date: d.date,
    } as FlatData;
  });
  const dataKeys = Array.from(dataKeySet);

  return { dataFlattened, dataKeys };
};
*/
