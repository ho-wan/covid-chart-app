import { ChartAction, ChartState } from "../chart.types";
import { CHART_ACTIONS } from "./chart.actions";

const initialState: ChartState = {
  data: [],
};

export const chartReducer = (state = initialState, action: ChartAction) => {
  const { data } = action;

  switch (action.type) {
    case CHART_ACTIONS.ADD_DATA_TO_STORE:
      return {
        ...state,
        data,
      };
    default:
      return {
        ...state,
      };
  }
};
