import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home/Home";
import ErrorPage from "../Components/ErrorPage/ErrorPage";
import Loading from "../Components/Loading/Loading";
import SearchDonor from "../Pages/SearchDonor/SearchDonor";
import BloodDonationRequest from "../Pages/Blood-Donation-Request/BloodDonationRequest";
import RequestDetails from "../Pages/Request-Details/RequestDetails";
import AuthLayout from "../Layouts/AuthLayout";
import Register from "../Pages/Auth/Register/Register";
import Login from "../Pages/Auth/Login/Login";
import PrivateRoutes from "./PrivateRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage></ErrorPage>,
    element: <RootLayout></RootLayout>,
    hydrateFallbackElement: <Loading></Loading>,
    children: [
      {
        index: true,
        Component: Home

      },
      {
        path: "searchDonor",
        Component: SearchDonor
      },
      {
        path: "bloodDonationRequest",
        element: <PrivateRoutes><BloodDonationRequest></BloodDonationRequest></PrivateRoutes>

      },
      {
        path: "requestDetails",
        element: <RequestDetails></RequestDetails>

      }
    ]
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login

      },
      {
        path: "register",
        loader: async () => {
          const [districtsRes, upazilasRes] = await Promise.all([
            fetch("/districts.json"),
            fetch("/upazilas.json")  
          ]);

          return {
            districts: await districtsRes.json(),
            upazilas: await upazilasRes.json() 
          };
        },
        Component: Register
      }
    ]
  }
]);