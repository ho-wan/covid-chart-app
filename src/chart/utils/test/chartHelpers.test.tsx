import { Serie } from "@nivo/line";
import { DateData } from "../../chart.types";
import { EMACalc, formatDataForNivo, SMACalc } from "../chartHelpers";

test("formats data for Nivo charts", () => {
  const want: Serie[] = [
    {
      id: "China",
      data: [
        {
          x: new Date(Date.parse("2020-03-05")),
          cases: 800,
          delta: 800,
        },
        {
          x: new Date(Date.parse("2020-03-06")),
          cases: 900,
          delta: 100,
        },
      ],
    },
    {
      id: "Japan",
      data: [
        {
          x: new Date(Date.parse("2020-03-05")),
          cases: 360,
          delta: 360,
        },
        {
          x: new Date(Date.parse("2020-03-06")),
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

describe("EMACalc", () => {
  test("range=5", () => {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const range = 5;
    const got = EMACalc(nums, range);
    const want = [
      1,
      1.3333333333333335,
      1.888888888888889,
      2.5925925925925926,
      3.3950617283950617,
      4.263374485596708,
      5.175582990397805,
      6.117055326931871,
      7.078036884621247,
    ];
    expect(got).toEqual(want);
  });

  test("range=1", () => {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const range = 1;
    const got = EMACalc(nums, range);
    expect(got).toEqual(nums);
  });
});

describe("SMACalc", () => {
  test("range=5", () => {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const range = 5;
    const got = SMACalc(nums, range);
    const want = [
      1,
      1.5,
      2,
      2.5,
      3,
      4,
      5,
      6,
      7,
    ];
    expect(got).toEqual(want);
  });

  test("range=1", () => {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const range = 1;
    const got = SMACalc(nums, range);
    expect(got).toEqual(nums);
  });
});
