import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { fetchDataAction } from "./redux/chart.actions";
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
  const dispatch = useDispatch();

  useEffect(() => {
    // fetch data from API on mount
    dispatch(fetchDataAction());
  });

  return (
    <>
      <StyledChartCardDiv>ChartCard</StyledChartCardDiv>
    </>
  );
}

export default ChartCard;
