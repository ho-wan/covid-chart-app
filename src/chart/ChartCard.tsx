import { ResponsiveLine } from "@nivo/line";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { fetchDataAction } from "./redux/chart.actions";
import { chartSelectors } from "./redux/chart.reducer";
import { formatDataForNivo } from "./utils/chartHelpers";
import { CHART_PROPS, COLORS } from "./utils/constants";

const StyledChartCardDiv = styled.div`
  /* auto margin 800w - responsive to fit screen width */
  @media (min-width: ${CHART_PROPS.chartWidth + 100}px) {
    width: ${CHART_PROPS.chartWidth}px;
    margin-left: auto;
    margin-right: auto;
  }

  height: 500px;

  background-color: ${COLORS.white};
  margin: 20px;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid ${COLORS.mediumGrey};
`;

function ChartCard() {
  const dispatch = useDispatch();
  // call once on first load only - TODO add button to fetch API manually in case fail
  useEffect(() => {
    dispatch(fetchDataAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = useSelector(chartSelectors.dataSelector);
  // const { dataFlattened, dataKeys } = flattenData(data);
  const nivoData = formatDataForNivo(data);

  return (
    <>
      <h1>Covid Chart</h1>
      <StyledChartCardDiv>
        {data.length > 0 && (
          <>
            <ResponsiveLine data={nivoData} />
          </>
        )}
      </StyledChartCardDiv>
    </>
  );
}

export default ChartCard;
