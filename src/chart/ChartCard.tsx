import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import styled from "styled-components";
import { DateData, FlatData, FlatCountryCase } from "./chart.types";
import { fetchDataAction } from "./redux/chart.actions";
import { chartSelectors } from "./redux/chart.reducer";
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

const flattenData = function(data: DateData[]): FlatData[] {
  const dataFlattened = data.map((d, i) => {
    // sum up cases by country and store in temp dict
    const dict: FlatCountryCase = {};
    d.regionData.forEach(rd => {
      if (dict[rd.country] == null) {
        dict[rd.country] = rd.cases;
      } else {
        dict[rd.country] += rd.cases;
      }
    });

    return {
      ...dict,
      date: d.date,
    } as FlatData;
  });

  return dataFlattened;
};

function ChartCard() {
  const dispatch = useDispatch();
  // call once on first load only - TODO add button to fetch API manually in case fail
  useEffect(() => {
    dispatch(fetchDataAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = useSelector(chartSelectors.dataSelector);
  const dataFlattened = flattenData(data);

  return (
    <>
      <StyledChartCardDiv>
        ChartCard
        {data.length && (
          <ResponsiveContainer>
            <LineChart data={dataFlattened} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="US" stroke="#ff7300" yAxisId={0} animationDuration={500} />
              <Line type="monotone" dataKey="UK" stroke="#ff7300" yAxisId={0} animationDuration={500} />
              <Line type="monotone" dataKey="South Korea" stroke="#ff7300" yAxisId={0} animationDuration={500} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </StyledChartCardDiv>
    </>
  );
}

export default ChartCard;
