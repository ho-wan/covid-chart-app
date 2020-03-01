import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from "recharts";
import styled from "styled-components";
import { DateData, FlatCountryCase, FlatData } from "./chart.types";
import { fetchDataAction } from "./redux/chart.actions";
import { chartSelectors } from "./redux/chart.reducer";
import { CHART_COLORS, CHART_PROPS, COLORS } from "./utils/constants";

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

const flattenData = function(data: DateData[]) {
  const dataKeySet: Set<string> = new Set();
  const dataFlattened = data.map((d) => {
    // sum up cases by country and store in temp dict
    const dict: FlatCountryCase = {};
    d.regionData.forEach(rd => {
      if (dict[rd.country] == null) {
        dict[rd.country] = rd.cases;
      } else {
        dict[rd.country] += rd.cases;
      }

      dataKeySet.add(rd.country);
    });

    return {
      ...dict,
      date: d.date,
    } as FlatData;
  });
  const dataKeys = Array.from(dataKeySet);

  return { dataFlattened, dataKeys };
};

function ChartCard() {
  const dispatch = useDispatch();
  // call once on first load only - TODO add button to fetch API manually in case fail
  useEffect(() => {
    dispatch(fetchDataAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = useSelector(chartSelectors.dataSelector);
  const { dataFlattened, dataKeys } = flattenData(data);

  const dataKeysFiltered = dataKeys.filter(v => v !== "China");

  function customTooltip(e: TooltipProps) {
    if (e.active && e.payload) {
      const sorted = Array.from(e.payload).sort((a, b) => a.value > b.value ? -1 : 1)
      return (
        <div className="custom-tooltip">
          <p>{`date: ${e.label}`}</p>
          <p>{`${sorted[0].dataKey}: ${sorted[0].value}`}</p>
          <p>{`${sorted[1].dataKey}: ${sorted[1].value}`}</p>
          <p>{`${sorted[2].dataKey}: ${sorted[2].value}`}</p>
          <p>{`${sorted[3].dataKey}: ${sorted[3].value}`}</p>
          <p>{`${sorted[4].dataKey}: ${sorted[4].value}`}</p>
        </div>
      );
    }
    return null;
  }

  return (
    <>
      <h1>Covid Chart</h1>
      <span>by Spandraw</span>
      <StyledChartCardDiv>
        {data.length > 0 && (
          <ResponsiveContainer>
            <LineChart data={dataFlattened} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={customTooltip} isAnimationActive={false} />
              <CartesianGrid strokeDasharray="3 3" />
              {dataKeysFiltered.map((dKey, i) => (
                <Line
                  key={i}
                  type="monotone"
                  dataKey={dKey}
                  stroke={CHART_COLORS[i]}
                  yAxisId={0}
                  animationDuration={500}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </StyledChartCardDiv>
    </>
  );
}

export default ChartCard;
