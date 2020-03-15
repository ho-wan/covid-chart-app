import { ResponsiveLine } from "@nivo/line";
import React, { ReactText, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
// import { DateData } from "./chart.types";
import { fetchDataAction } from "./redux/chart.actions";
import { chartSelectors } from "./redux/chart.reducer";
import { formatDataForNivo, getLastNDaysData, getMostRecentDelta } from "./utils/chartHelpers";
import { CHART_PROPS, COLORS } from "./utils/constants";

const StyledChartTitle = styled.h3`
  padding: 5px;
  margin: 0px;
`;

const StyledChartCardDiv = styled.div`
  /* auto margin 800w - responsive to fit screen width */
  @media (min-width: ${CHART_PROPS.chartWidth + 100}px) {
    width: ${CHART_PROPS.chartWidth}px;
    margin-left: auto;
    margin-right: auto;
  }

  height: 300px;

  background-color: ${COLORS.white};
  margin: 10px;
  margin-top: 5px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid ${COLORS.mediumGrey};
`;

function ChartCard() {
  const nDays = 13;
  const nCountries = 10;

  const dispatch = useDispatch();
  // call once on first load only - TODO add button to fetch API manually in case fail
  useEffect(() => {
    dispatch(fetchDataAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dateData = useSelector(chartSelectors.dataSelector);

  const nivoData = formatDataForNivo(dateData);

  // array of the top nCountries with largest increase in cases
  const mostDeltaCountries: ReactText[] = getMostRecentDelta(dateData)
    .slice(0, nCountries)
    .map(dd => dd.country);

  const filteredData = nivoData.filter(v => mostDeltaCountries.includes(v.id));

  const data = getLastNDaysData(filteredData, nDays);

  return (
    <>
      <StyledChartTitle>Covid Chart</StyledChartTitle>
      <StyledChartCardDiv>
        {data.length > 0 && (
          <>
            <ResponsiveLine
              data={data}
              margin={{ top: 20, right: 100, bottom: 20, left: 60 }}
              yScale={{ type: "linear", min: "auto", max: "auto", stacked: true }}
              xScale={{
                type: "time",
                precision: "day",
              }}
              axisBottom={{
                tickValues: "every 2 days",
                format: "%b %d",
              }}
              axisLeft={{
                legend: "Delta (daily increase in cases)",
                legendOffset: -50,
                legendPosition: "middle",
              }}
              colors={{ scheme: "nivo" }}
              pointSize={5}
              pointColor={{ theme: "background" }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              // pointLabel="y"
              // pointLabelYOffset={-12}
              // useMesh={true}
              legends={[
                {
                  anchor: "bottom-right",
                  direction: "column",
                  justify: false,
                  translateX: 100,
                  translateY: 0,
                  itemsSpacing: 0,
                  itemDirection: "left-to-right",
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: "circle",
                  symbolBorderColor: "rgba(0, 0, 0, .5)",
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemBackground: "rgba(0, 0, 0, .03)",
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]}
            />
          </>
        )}
      </StyledChartCardDiv>
    </>
  );
}

export default ChartCard;
