import { ResponsiveLine, Serie } from "@nivo/line";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { fetchDataAction } from "./redux/chart.actions";
import { chartSelectors } from "./redux/chart.reducer";
import { formatDataForNivo, formatDateString, getLastNDaysData, getMostRecentDelta } from "./utils/chartHelpers";
import { CHART_PROPS, COLORS } from "./utils/constants";

const StyledChartTitle = styled.h4`
  @media (min-height: 600px) {
    font-size: 30px;
    margin: 20px;
  }

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

  @media (min-height: 700px) {
    height: 650px;
  }

  @media (min-height: 500px) and (max-height: 700px) {
    height: 450px;
  }

  @media (max-height: 350px) {
    height: 250px;
  }

  height: 300px;

  background-color: ${COLORS.white};
  margin: 10px;
  padding: 10px;
  margin-top: 0px;
  padding-top: 0px;
  border-radius: 10px;
  border: 1px solid ${COLORS.mediumGrey};
`;

const StyledCustomTooltipDiv = styled.div`
  background-color: ${`${COLORS.white}${COLORS.transparency80}`};
  padding: 0px 10px 0px 10px;

  border-radius: 10px;
  border-radius: 10px;
  border: 1px solid ${COLORS.mediumGrey};
`;

// use any inplace of fPointTooltipProps
function CustomTooltip(props: React.PropsWithChildren<any>) {
  const { point } = props;

  return (
    <StyledCustomTooltipDiv>
      <b>{point.serieId}</b>
      <div>{point.data.xFormatted}</div>
      <div>{`cases: ${point.data.cases}`}</div>
      <div>{`delta: ${point.data.delta}`}</div>
    </StyledCustomTooltipDiv>
  );
}

function ChartCard() {
  // TODO move to state
  const nDays = 13;
  const nCountries = 8;
  const showDelta = true;

  const dispatch = useDispatch();
  // call once on first load only - TODO add button to fetch API manually in case fail
  useEffect(() => {
    dispatch(fetchDataAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dateData = useSelector(chartSelectors.dataSelector);

  const nivoData = formatDataForNivo(dateData, showDelta);

  // array of the top nCountries with largest increase in cases
  const mostDeltaCountries = getMostRecentDelta(dateData)
    .slice(0, nCountries)
    .map(dd => dd.country);

  // add countries in order of delta - TODO can make this more efficient using a hash
  const filteredData: Serie[] = [];
  mostDeltaCountries.forEach(co => {
    nivoData.forEach(s => {
      if (s.id.toString() === co) {
        filteredData.push(s);
      }
    });
  });

  // reverse to show legend in correcy order
  const data = getLastNDaysData(filteredData, nDays).reverse();

  return (
    <>
      <StyledChartTitle>{`Covid-19: Countries with highest daily increase in cases (delta)`}</StyledChartTitle>
      <StyledChartCardDiv>
        {data.length > 0 && (
          <>
            <ResponsiveLine
              data={data}
              margin={{ top: 20, right: 20, bottom: 20, left: 60 }}
              yScale={{ type: "linear", min: "auto", max: "auto" }}
              xScale={{ type: "point" }}
              xFormat={formatDateString}
              axisBottom={{
                format: formatDateString,
              }}
              axisLeft={{
                legend: showDelta ? "Delta (daily increase in cases)" : "cases",
                legendOffset: -50,
                legendPosition: "middle",
              }}
              colors={{ scheme: "category10" }}
              pointSize={5}
              pointColor={{ theme: "background" }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              useMesh={true}
              tooltip={CustomTooltip}
              legends={[
                {
                  anchor: "top-left",
                  direction: "column",
                  justify: false,
                  translateX: 10,
                  translateY: 10,
                  itemsSpacing: 0,
                  itemDirection: "left-to-right",
                  itemWidth: 0,
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
      <div>
        <p></p>
      </div>
    </>
  );
}

export default ChartCard;
