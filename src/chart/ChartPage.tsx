import React from "react";
import styled from "styled-components";
import ChartCard from "./ChartCard";
import { CHART_PROPS } from "./utils/constants";

const StyledChartCardPageDiv = styled.div`
  /* auto margin 800w - responsive to fit screen width */
  @media (min-width: ${CHART_PROPS.chartWidth + 100}px) {
    width: ${CHART_PROPS.chartWidth}px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const StyledChartTitleH2 = styled.h2`
  margin: auto;
  margin-top: 0px;
  margin-bottom: 0px;

  @media (min-width: 400px) and (min-height: 600px) {
    font-size: 30px;
  }
`;

function ChartPage() {
  return (
    <StyledChartCardPageDiv>
      <StyledChartTitleH2>{"DeltaCov Chart"}</StyledChartTitleH2>
      <ChartCard />
    </StyledChartCardPageDiv>
  );
}

export default ChartPage;
