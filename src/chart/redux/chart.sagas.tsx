import { all, call, put, takeEvery } from "redux-saga/effects";
import { getRequest } from "../utils/apiHelpers";
import { COVID_API_URL } from "../utils/constants";
import { CHART_ACTIONS } from "./chart.actions";

function* fetchDataSaga() {
  try {
    const response = yield call(fetch, `${COVID_API_URL.baseUrl}/${COVID_API_URL.data}`, getRequest());
    if (response.ok) {
      const resJson = yield response.json();

      yield put({ type: CHART_ACTIONS.FETCH_DATA_SUCCESS });

      console.log("resJson");
      console.log(resJson);
      // TODO put data into store
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
