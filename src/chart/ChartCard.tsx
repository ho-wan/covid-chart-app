import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { loadChart } from "./d3/d3chart";
import { fetchDataAction } from "./redux/chart.actions";
import { chartSelectors } from "./redux/chart.reducer";
import { COLORS } from "./utils/constants";

const StyledChartCardDiv = styled.div`
  /* auto margin 800w - responsive to fit screen width */
  @media (min-width: 1000px) {
    width: 700px;
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

  const dispatch = useDispatch();

  useEffect(() => {
    // fetch data from API on mount
    dispatch(fetchDataAction());
  }, [dispatch]);

  useEffect(() => {
    // fetch data from API on mount
    loadChart(data);
  }, [data]);

  return (
    <>
      <StyledChartCardDiv>ChartCard</StyledChartCardDiv>
    </>
  );
}

export default ChartCard;
