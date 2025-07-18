import { combineReducers } from "redux";
import LoginReducer from "./auth/loginReducer";
import LogoutReducer from "./auth/logoutReducer";
import profileReducer from "./auth/profileReducer";
import productReducer from "./products/productReducer";
import sellerReducer from "./seller";
import userReducer from "./users/userReducer";
import categoryReducer from "./categories/categoryReducer";
import bannerReducer from "./banner/bannerReducer";
import { heroSliderReducer } from "./banner/heroSliderReducer";
import dashboardReducer from "./dashboard/dashboardReducer";

const appReducer = combineReducers({
  auth: LoginReducer,
  Logout: LogoutReducer,
  profile: profileReducer,
  products: productReducer,
  sellers: sellerReducer,
  users: userReducer,
  categories: categoryReducer,
  banner: bannerReducer,
  heroSlider: heroSliderReducer,
  dashboard: dashboardReducer,
});

export type RootState = ReturnType<typeof appReducer>;
export default appReducer;
