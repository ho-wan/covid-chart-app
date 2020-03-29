import { ResponsiveLine } from "@nivo/line";
import { Button, Input, Modal, Radio, Row, Select, Spin, Tooltip } from "antd";
import { RadioChangeEvent } from "antd/lib/radio";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { fetchDataAction } from "./redux/chart.actions";
import { chartSelectors } from "./redux/chart.reducer";
// prettier-ignore
import { formatDateString, getFormattedData, tickSpacing } from "./utils/chartHelpers";
import { CHART_PROPS, COLORS, EXT_LINKS } from "./utils/constants";

const StyledChartTitleH2 = styled.h2`
  margin: auto;
  margin-top: 0px;
  margin-bottom: 0px;

  @media (min-width: 400px) and (min-height: 600px) {
    font-size: 30px;
  }
`;

const StyledAlignRightDiv = styled.div`
  margin-right: 10px;
  margin-left: auto;
`;

const StyledRow = styled(Row)``;

const StyledControlElementDiv = styled.div`
  margin-left: 10px;
  margin-bottom: 10px;
`;

const StyledChartCardPageDiv = styled.div`
  /* auto margin 800w - responsive to fit screen width */
  @media (min-width: ${CHART_PROPS.chartWidth + 100}px) {
    width: ${CHART_PROPS.chartWidth}px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const StyledChartCardDiv = styled.div`
  @media (min-height: 750px) {
    height: 600px;
  }

  @media (min-height: 550px) and (max-height: 750px) {
    height: 80vh;
  }

  @media (max-height: 350px) {
    height: 250px;
  }

  height: 300px;

  background-color: ${COLORS.white};
  margin: 10px;
  margin-top: 0px;
  margin-bottom: 0px;
  padding: 5px;
  padding-top: 0px;
  border-radius: 10px;
  border: 1px solid ${COLORS.mediumGrey};
`;

const StyledSpinnerDiv = styled.div`
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  font-size: 30px;
`;

const StyledCustomTooltipDiv = styled.div`
  background-color: ${`${COLORS.white}${COLORS.transparency80}`};
  padding: 0px 10px 0px 10px;

  border-radius: 10px;
  border-radius: 10px;
  border: 1px solid ${COLORS.mediumGrey};
`;

// use any inplace of PointTooltipProps
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

export type ShowDelta = "delta" | "dDelta" | "total";
interface State {
  showDelta: ShowDelta;
  dateRange: number;
  movingAvDays: number;
  showAboutModal: boolean;
}

function ChartCard() {
  const initialState: State = {
    showDelta: "delta",
    dateRange: 14,
    movingAvDays: 5,
    showAboutModal: false,
  };
  const [showAboutModal, setShowAboutModal] = useState(initialState.showAboutModal);
  const [showDelta, setShowDelta] = useState(initialState.showDelta);
  const [dateRange, setDateRange] = useState(initialState.dateRange);
  const [movingAvDays, setMovingAvDays] = useState(initialState.movingAvDays);
  // TODO move to state if editable
  const nCountries = 8;

  const toggleShowDelta = function(e: RadioChangeEvent) {
    setShowDelta(e.target.value);

    if (e.target.value == "total") {
      setMovingAvDays(1);
    }
  };

  const toggleMovingAverage = function(e: RadioChangeEvent) {
    setMovingAvDays(e.target.value);
  };

  const getLegendByShowDelta = function(showDelta: ShowDelta) {
    let legendText: string;
    if (showDelta == "delta") {
      legendText = "Delta (daily increase in cases)";
    } else if (showDelta == "dDelta") {
      legendText = "Delta of Delta (rate of daily increase)";
    } else {
      legendText = "Total cases";
    }
    return legendText;
  };

  const dispatch = useDispatch();
  // call once on first load only - TODO add button to fetch API manually in case fail
  useEffect(() => {
    dispatch(fetchDataAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dateData = useSelector(chartSelectors.dataSelector, shallowEqual);

  // this gets called on every render - TODO only do this once when data fetched, not sure how to do with hooks + redux
  const data = getFormattedData(dateData, { showDelta, dateRange, nCountries, movingAvDays });

  return (
    <StyledChartCardPageDiv>
      <StyledChartTitleH2>{"DeltaCov Chart"}</StyledChartTitleH2>
      <StyledRow justify="start" align="middle">
        <StyledControlElementDiv>
          <Radio.Group value={showDelta} onChange={toggleShowDelta} buttonStyle="solid" size="small">
            <Tooltip placement="bottom" title="Daily increase in cases">
              <Radio.Button value={"delta"}>Delta</Radio.Button>
            </Tooltip>
            <Tooltip placement="bottom" title="Rate of daily increase. < 0 indicates growth of virus has peaked">
              <Radio.Button value={"dDelta"}>dDelta</Radio.Button>
            </Tooltip>
            <Radio.Button value={"total"}>Total</Radio.Button>
          </Radio.Group>
        </StyledControlElementDiv>
        <StyledControlElementDiv>
          <Radio.Group value={movingAvDays} onChange={toggleMovingAverage} buttonStyle="solid" size="small">
            <Tooltip placement="bottom" title="10 day exponential moving average">
              <Radio.Button value={10}>MA-10</Radio.Button>
            </Tooltip>
            <Tooltip placement="bottom" title="5 day exponential moving average">
              <Radio.Button value={5}>MA-5</Radio.Button>
            </Tooltip>
            <Radio.Button value={1}>Raw</Radio.Button>
          </Radio.Group>
        </StyledControlElementDiv>
        <StyledControlElementDiv>
          <Select
            defaultValue={initialState.dateRange}
            onChange={e => setDateRange(e.valueOf())}
            size="small"
            style={{ width: 90 }}
          >
            <Select.Option value={7}>7 Days</Select.Option>
            <Select.Option value={14}>14 Days</Select.Option>
            <Select.Option value={28}>28 Days</Select.Option>
          </Select>
        </StyledControlElementDiv>
        <StyledAlignRightDiv>
          <StyledControlElementDiv>
            <Button onClick={() => setShowAboutModal(true)} shape="round" size="small" value={"about"}>
              About
            </Button>
          </StyledControlElementDiv>
        </StyledAlignRightDiv>
      </StyledRow>
      <StyledChartCardDiv>
        {data.length == 0 && (
          <StyledSpinnerDiv>
            <Spin tip="Loading..." size="large" />
          </StyledSpinnerDiv>
        )}
        {data.length > 0 && (
          <>
            <ResponsiveLine
              data={data}
              margin={{ top: 20, right: 60, bottom: 25, left: 20 }}
              yScale={{ type: "linear", min: "auto", max: "auto" }}
              xFormat={formatDateString}
              xScale={{
                type: "time",
                precision: "day",
              }}
              axisBottom={{
                tickValues: `every ${tickSpacing[dateRange]} days`,
                format: "%d %b",
              }}
              axisLeft={null}
              axisRight={{
                legend: getLegendByShowDelta(showDelta),
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
              crosshairType="bottom-right"
              legends={[
                {
                  anchor: "top-left",
                  direction: "column",
                  justify: false,
                  translateX: 5,
                  translateY: 5,
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
      <Modal
        title="DeltaCov by Spandraw"
        visible={showAboutModal}
        onCancel={() => setShowAboutModal(false)}
        onOk={() => setShowAboutModal(false)}
      >
        <p>{"Created by Ho-Wan To"}</p>
        <p>
          {"For business enquiries, contact me at: "}
          <a href={`mailto:${EXT_LINKS.businessEmail}`} target="_blank" rel="noopener noreferrer">
            {EXT_LINKS.businessEmail}
          </a>
        </p>
        <p>
          {"Embed: "}
          <Input.TextArea defaultValue={EXT_LINKS.embed} />
        </p>
      </Modal>
    </StyledChartCardPageDiv>
  );
}

export default ChartCard;
