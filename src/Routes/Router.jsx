import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home/Home";
import ErrorPage from "../Components/ErrorPage/ErrorPage";
import Loading from "../Components/Loading/Loading";
import SearchDonor from "../Pages/SearchDonor/SearchDonor";
import BloodDonationRequest from "../Pages/Blood-Donation-Request/BloodDonationRequest";
import RequestDetails from "../Pages/Request-Details/RequestDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement:<ErrorPage></ErrorPage>,
    element: <RootLayout></RootLayout>,
    hydrateFallbackElement:<Loading></Loading>,
    children:[
        {
            index:true,
            Component:Home
            
        },
        {
          path:"searchDonor",
          Component:SearchDonor
        },
        {
          path:"bloodDonationRequest",
          element:<BloodDonationRequest></BloodDonationRequest>

        },
        {
          path:"requestDetails",
          element:<RequestDetails></RequestDetails>

        }
    ]
  },
]);