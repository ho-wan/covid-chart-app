import { all, call, put, takeEvery } from "redux-saga/effects";
import { AllDateData } from "../chart.types";
import { getRequest } from "../utils/apiHelpers";
import { COVID_API_URL } from "../utils/constants";
import { CHART_ACTIONS } from "./chart.actions";

function* fetchDataSaga() {
  try {
    const response = yield call(fetch, `${COVID_API_URL.baseUrl}/${COVID_API_URL.data}`, getRequest());
    if (response.ok) {
      const resJson: AllDateData = yield response.json();
      const { data } = resJson;

      yield put({ type: CHART_ACTIONS.FETCH_DATA_SUCCESS });

      yield put({
        type: CHART_ACTIONS.ADD_DATA_TO_STORE,
        data,
      });
    } else {
      throw new Error("Error fetching data");
    }
  } catch (e) {
    console.error(e);
    yield put({ type: CHART_ACTIONS.FETCH_DATA_FAIL });
  }
}

function* watchFetchDataAction() {
  yield takeEvery(CHART_ACTIONS.FETCH_DATA, fetchDataSaga);
}

export default function* chartSagas() {
  yield all([watchFetchDataAction()]);
}
