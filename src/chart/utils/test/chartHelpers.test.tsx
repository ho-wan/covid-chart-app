import { Serie } from "@nivo/line";
import { DateData } from "../../chart.types";
import { formatDataForNivo } from "../chartHelpers";

test("formats data for Nivo charts", () => {
  const want: Serie[] = [
    {
      id: "China",
      data: [
        {
          x: "2020-03-05",
          y: 800,
          cases: 800,
          delta: 800,
        },
        {
          x: "2020-03-06",
          y: 900,
          cases: 900,
          delta: 100,
        },
      ],
    },
    {
      id: "Japan",
      data: [
        {
          x: "2020-03-05",
          y: 360,
          cases: 360,
          delta: 360,
        },
        {
          x: "2020-03-06",
          y: 420,
          cases: 420,
          delta: 60,
        },
      ],
    },
  ];

  const rawData: DateData[] = [
    {
      date: "2020-03-05",
      reportNumber: 1,
      regionData: [
        {
          co: "China",
          n: 800,
        },
        {
          co: "Japan",
          n: 360,
        },
      ],
    },
    {
      date: "2020-03-06",
      reportNumber: 2,
      regionData: [
        {
          co: "China",
          n: 900,
        },
        {
          co: "Japan",
          n: 420,
        },
      ],
    },
  ];
  const got = formatDataForNivo(rawData);
  expect(got).toEqual(want);
});
