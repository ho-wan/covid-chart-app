// @ts-nocheck
import * as d3 from "d3";
import { D3ChartProps } from "../chart.types";
import { CHART_ID, CHART_PROPS } from "../utils/constants";

export function createChart() {
  console.log("createChart");
  d3.select(`#${CHART_ID.svgDiv}`)
    .append("svg")
    .attr("id", CHART_ID.svg)
    .attr("width", CHART_PROPS.chartWidth);
}

// loadChart using d3.js
export function loadChart({ chartProps, data }: D3ChartProps) {
  // only call if data is not null
  if (data == undefined || data.length == 0) return;
  console.log("loadChart");

  const chartSVG = d3.select(`#${CHART_ID.svg}`);
  const x = d3
    .scaleUtc()
    .domain(d3.extent(data, d => new Date(d.date)))
    .range([0, chartProps.chartWidth]);

  const xAxis = g =>
    g.attr("transform", `translate(0,100)`).call(
      d3
        .axisBottom(x)
        .ticks(chartProps.chartWidth / 100)
        .tickSizeOuter(0)
    );

  chartSVG.append("g").call(xAxis);
}
