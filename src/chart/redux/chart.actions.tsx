export const CHART_ACTIONS = {
  FETCH_DATA: "FETCH_DATA",
  FETCH_DATA_SUCCESS: "FETCH_DATA_SUCCESS",
  FETCH_DATA_FAIL: "FETCH_DATA_FAIL",
};

export const fetchDataAction = () => ({
  type: CHART_ACTIONS.FETCH_DATA,
});
