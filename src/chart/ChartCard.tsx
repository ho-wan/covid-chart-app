import { ResponsiveLine, Serie } from "@nivo/line";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import ToggleSwitch from "./components/ToggleSwitch";
import { fetchDataAction } from "./redux/chart.actions";
import { chartSelectors } from "./redux/chart.reducer";
// prettier-ignore
import { formatDataForNivo, formatDateString, getLastNDaysData, getDeltaData, sortDataByDelta, sortDataByCases } from "./utils/chartHelpers";
import { CHART_PROPS, COLORS } from "./utils/constants";
import { Button } from 'antd';

const StyledChartTitle = styled.h4`
  @media (min-height: 600px) {
    font-size: 30px;
    margin-top: 20px;
  }

  padding: 5px;
  margin: 0px;
`;

const StyledControlsDiv = styled.div`
  font-size: 12px;
`

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
  margin-top: 5px;
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
      <div>{`Total: ${point.data.cases}`}</div>
      <div>{`Delta: ${point.data.delta}`}</div>
    </StyledCustomTooltipDiv>
  );
}

function ChartCard() {
  const [showDelta, setShowDelta] = useState(true);
  // TODO move to state
  const nDays = 13;
  const nCountries = 8;

  const dispatch = useDispatch();
  // call once on first load only - TODO add button to fetch API manually in case fail
  useEffect(() => {
    dispatch(fetchDataAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dateData = useSelector(chartSelectors.dataSelector);

  const nivoData = formatDataForNivo(dateData, showDelta);

  // array of the top nCountries with largest increase in cases
  const dataWithDelta = getDeltaData(dateData);

  // sort by delta or cases
  const orderedData = showDelta ? sortDataByDelta(dataWithDelta) : sortDataByCases(dataWithDelta);

  // get list of names for the top N number of countries - TODO use UID instead of string
  let orderedCountries = orderedData.slice(0, nCountries).map(dd => dd.country);

  // add countries in order of delta - TODO can make this more efficient using a hash
  const filteredData: Serie[] = [];
  orderedCountries.forEach(co => {
    nivoData.forEach(s => {
      if (s.id.toString() === co) {
        filteredData.push(s);
      }
    });
  });

  // reverse to show legend in correcy order
  let data = getLastNDaysData(filteredData, nDays).reverse();

  return (
    <>
      <StyledChartTitle>{"DeltaCov Chart"}</StyledChartTitle>
      <StyledControlsDiv>
        Delta <ToggleSwitch onChange={() => setShowDelta(!showDelta)} /> Total
        <Button type="primary">Button</Button>
      </StyledControlsDiv>
      <StyledChartCardDiv>
        {data.length > 0 && (
          <>
            <ResponsiveLine
              data={data}
              margin={{ top: 10, right: 60, bottom: 20, left: 10 }}
              yScale={{ type: "linear", min: "auto", max: "auto" }}
              xFormat={formatDateString}
              xScale={{
                type: "time",
                precision: "day",
              }}
              axisBottom={{
                tickValues: "every 2 days",
                format: "%b %d",
              }}
              axisLeft={null}
              axisRight={{
                legend: showDelta ? "Delta (daily increase in cases)" : "Total cases",
                legendOffset: 50,
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
