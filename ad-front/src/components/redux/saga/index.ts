import { all } from "redux-saga/effects";
import watchLoginAPI from "./auth/loginSaga";
import watchLogoutAPI from "./auth/logoutSaga";
import watchProfileAPI from "./auth/profileSaga";
import watchProductAPI from "./products/productSaga";
import { sellerSagas } from "./seller";
import userSaga from "./users/userSaga";
import { categorySaga } from "./categories/categorySaga";
import { bannerSaga } from "./banner/bannerSaga";
import { heroSliderSaga } from "./banner/heroSliderSaga";
import { dashboardSaga } from "./dashboard/dashboardSaga";

export default function* rootSaga() {
  yield all([watchLoginAPI(), watchLogoutAPI(), watchProfileAPI(), watchProductAPI(), sellerSagas(), userSaga(), categorySaga(), bannerSaga(), heroSliderSaga(), dashboardSaga()]);
}
