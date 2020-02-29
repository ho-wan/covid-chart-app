import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { createChart, loadChart } from "./d3/d3chart";
import { fetchDataAction } from "./redux/chart.actions";
import { chartSelectors } from "./redux/chart.reducer";
import { CHART_ID, CHART_PROPS, COLORS } from "./utils/constants";

const StyledChartCardDiv = styled.div`
  /* auto margin 800w - responsive to fit screen width */
  @media (min-width: 1000px) {
    width: ${CHART_PROPS.chartWidth}px;
    margin-left: auto;
    margin-right: auto;
  }

  background-color: ${COLORS.white};
  margin: 20px;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid ${COLORS.mediumGrey};
`;

function ChartCard() {
  const data = useSelector(chartSelectors.dataSelector);
  // const onFirstLoad = data === [];

  const chartProps = {
    chartWidth: CHART_PROPS.chartWidth,
  };

  const dispatch = useDispatch();

  // call once on first load only - TODO add button to fetch API manually in case fail
  useEffect(() => {
    // fetch data from API on mount
    dispatch(fetchDataAction());
    createChart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // call when data is returned from API
  useEffect(() => {
    loadChart({ chartProps, data });
  }, [chartProps, data]);

  return (
    <>
      <StyledChartCardDiv>
        ChartCard
        <div id={CHART_ID.svgDiv} />
        {/* <svg width={CHART_PROPS.chartWidth} id={CHART_ID.svg} /> */}
        {/* </div> */}
      </StyledChartCardDiv>
    </>
  );
}

export default ChartCard;
