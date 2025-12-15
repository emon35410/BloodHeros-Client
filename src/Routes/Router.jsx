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
import Location from "../Components/Location/Location";
import DashboardLayout from "../Layouts/DashboardLayout";
import HomePage from "../Pages/Dashboard/HomePage/HomePage";
import MyProfile from "../Pages/MyProfile/MyProfile";
import BloodRequest from "../Pages/Dashboard/Blood_Request/BloodRequest";
import MyBloodRequest from "../Pages/Dashboard/My_Blood_Request/MyBloodRequest";
import ViewDetails from "../Components/ViewDetails/ViewDetails";
import SupportUs from "../Components/SupportUs/SupportUs";
import PaymentSuccess from "../Pages/Payment/PaymentSuccess";
import PaymentCanceled from "../Pages/Payment/PaymentCanceled";
import AllSupportDonation from "../Pages/AllSupportDonation/AllSupportDonation";


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
        path:"location",
        Component:Location
      },
      {
        path:"myprofile",
        Component:MyProfile
      },
      {
        path:"supportDonation",
        Component:AllSupportDonation
      },
      {
        path:"requests/:id",
        loader: async()=> await fetch("http://localhost:3000/donorRequest"),
        Component:ViewDetails
      },
      {
        path:"supportus",
        element:<PrivateRoutes><SupportUs></SupportUs></PrivateRoutes>
      },
      {
        path: "payment-success",
        element:<PrivateRoutes><PaymentSuccess></PaymentSuccess></PrivateRoutes>
      },
      {
        path: "payment-canceled",
        Component: PaymentCanceled
      },
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
  },
  {
    path:"dashboard",
    element:<PrivateRoutes><DashboardLayout></DashboardLayout></PrivateRoutes>,
    children:[
      {
        index:true,
        element:<HomePage></HomePage>
      },
      {
        path:"bloodrequest",
        element:<BloodRequest></BloodRequest>
      },
      {
        path:"myrequests",
        element:<MyBloodRequest></MyBloodRequest>
      }
    ]
  }
]);