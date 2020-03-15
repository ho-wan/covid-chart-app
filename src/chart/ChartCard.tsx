import { ResponsiveLine } from "@nivo/line";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { fetchDataAction } from "./redux/chart.actions";
import { chartSelectors } from "./redux/chart.reducer";
import { formatDataForNivo, getMostRecentDelta } from "./utils/chartHelpers";
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
  margin: 20px;
  margin-top: 5px;
  padding: 20px;
  border-radius: 20px;
  border: 1px solid ${COLORS.mediumGrey};
`;

function ChartCard() {
  const dispatch = useDispatch();
  // call once on first load only - TODO add button to fetch API manually in case fail
  useEffect(() => {
    dispatch(fetchDataAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dateData = useSelector(chartSelectors.dataSelector);

  const nivoData = dateData.length > 0 ? formatDataForNivo(dateData) : [];

  const lastDelta = getMostRecentDelta(dateData);
  console.log(lastDelta.slice(0, 10));

  // only show first 10 countries to render faster - TODO show 10 largest only
  const data = nivoData.slice(0, 10);

  return (
    <>
      <StyledChartTitle>Covid Chart</StyledChartTitle>
      <StyledChartCardDiv>
        {data.length > 0 && (
          <>
            <ResponsiveLine
              data={data}
              margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
              xScale={{ type: "point" }}
              yScale={{ type: "linear", min: "auto", max: "auto" }}
              axisTop={null}
              axisRight={null}
              colors={{ scheme: "nivo" }}
            />
          </>
        )}
      </StyledChartCardDiv>
    </>
  );
}

export default ChartCard;
