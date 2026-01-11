import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home/Home";
import ErrorPage from "../Components/ErrorPage/ErrorPage";
import Loading from "../Components/Loading/Loading";
import SearchDonor from "../Pages/SearchDonor/SearchDonor";
import BloodDonationRequest from "../Pages/Blood-Donation-Request/BloodDonationRequest";
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
import AllUsers from "../Pages/Dashboard/All_Users/AllUsers";
import AllBloodRequest from "../Pages/Dashboard/All_Blood_Request/AllBloodRequest";
import AdminRoutes from "./AdminRoutes";
import AdminOrVolunteerRoute from "./AdminOrVolunteerRoute";
import BloodDonate from "../Pages/Donate_Blood/BloodDonate";
import AllDonateRequest from "../Pages/Dashboard/All_Donate_Request/AllDonateRequest";
import DonorDetailsView from "../Components/View/DonorDetailsView";
import DonorRequestDonation from "../Pages/Donor_Request_donation/DonorRequestDonation";
import AboutUs from "../Components/AboutUs/AboutUs";
import PrivacyPolicy from "../Components/PrivacyPolicy/PrivacyPolicy";
import TermsAndConditions from "../Components/TermsAndConditions/TermsAndConditions";


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
        path:"donorBloodRequest",
        element:<PrivateRoutes><DonorRequestDonation></DonorRequestDonation></PrivateRoutes>
      },
      {
        path: "location",
        Component: Location
      },
      {
        path: "myprofile",
        Component: MyProfile
      },
      {
        path: "supportDonation",
        Component: AllSupportDonation
      },
      {
        path: "requests/:id",
        element: <PrivateRoutes><ViewDetails></ViewDetails></PrivateRoutes>
      },
      {
        path: "donateRequest/:id",
        element: <PrivateRoutes><DonorDetailsView></DonorDetailsView></PrivateRoutes>
      },

      {
        path: "supportus",
        element: <PrivateRoutes><SupportUs></SupportUs></PrivateRoutes>
      },
      {
        path: "payment-success",
        element: <PrivateRoutes><PaymentSuccess></PaymentSuccess></PrivateRoutes>
      },
      {
        path: "payment-canceled",
        Component: PaymentCanceled
      },
      {
        path:"donateblood",
        element:<PrivateRoutes><BloodDonate></BloodDonate></PrivateRoutes>
      },
      {
        path: "about",
        element:<AboutUs></AboutUs>
      },
      {
        path: "privacy",
        element:<PrivacyPolicy></PrivacyPolicy>
      },
      {
        path: "terms",
        element:<TermsAndConditions></TermsAndConditions>
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
  },
  {
    path: "dashboard",
    element: <PrivateRoutes><DashboardLayout></DashboardLayout></PrivateRoutes>,
    children: [
      {
        index: true,
        element: <HomePage></HomePage>
      },
      {
        path: "bloodrequest",
        element: <BloodRequest></BloodRequest>
      },
      {
        path: "myrequests",
        element: <MyBloodRequest></MyBloodRequest>
      },
      {
        path: "allusers",
        element: <AdminRoutes><AllUsers></AllUsers></AdminRoutes>
      },
      {
        path: "allrequest",
        element: <AdminOrVolunteerRoute><AllBloodRequest></AllBloodRequest></AdminOrVolunteerRoute>
      },
      {
        path: "alldonaterequest",
        element: <AdminOrVolunteerRoute><AllDonateRequest></AllDonateRequest></AdminOrVolunteerRoute>
      }
    ]
  }
]);