import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage, { action as loginAction } from "./pages/LoginPage";
import SignupPage, { action as signupAction } from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import AnalyticsPage, {
  loader as analyticsLoader,
} from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import GroupDetails, {
  loader as groupDetailsLoader,
} from "./pages/GroupDetails";
import BillDetails, { loader as billDetailsLoader } from "./pages/BillDetails";
import ScanBill from "./pages/ScanBill";
import NavbarLayout from "./pages/NavbarLayout";
import { ThemeProvider } from "./context/ThemeContext";
import RootPage from "./pages/RootPage";
import { Toaster } from "sonner";
import UserContextProvider from "./context/UserContext";
import { action as joinGroupAction } from "./components/JoinGroup";
import { action as createGroupAction } from "./components/CreateGroup";
import { action as updateGroupAction } from "./components/UpdateGroup";
import GroupPage, { loader as groupPageLoader } from "./pages/GroupPage";
import BillSplit, { loader as billSplitLoader } from "./pages/BillSplit";
import NotFound from "./pages/NotFound";
import { authLoader, unAuthLoader } from "./pages/Auth";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootPage />,
      errorElement: <NotFound />,
      children: [
        {
          loader: unAuthLoader,
          children: [
            {
              path: "",
              element: <LandingPage />,
            },
            {
              path: "login",
              element: <LoginPage />,
              action: loginAction,
            },
            {
              path: "Signup",
              element: <SignupPage />,
              action: signupAction,
            },
          ],
        },
        {
          element: <NavbarLayout />,
          loader: authLoader,
          children: [
            {
              path: "home",
              element: <HomePage />,
            },
            {
              path: "analytics",
              element: <AnalyticsPage />,
              loader: analyticsLoader,
            },
            {
              path: "settings",
              element: <SettingsPage />,
            },
            {
              path: "groups",
              element: <GroupPage />,
              loader: groupPageLoader,
            },
            {
              path: "groups/:groupId",
              element: <GroupDetails />,
              loader: groupDetailsLoader,
            },
            {
              path: "groups/:groupId/bill/:billId/review",
              element: <BillDetails />,
              loader: billDetailsLoader,
            },
            {
              path: "groups/:groupId/bill/:billId/split",
              element: <BillSplit />,
              loader: billSplitLoader,
            },
            {
              path: "scan",
              element: <ScanBill />,
            },
          ],
        },
        {
          path: "/join",
          action: joinGroupAction,
        },
        {
          path: "/create",
          action: createGroupAction,
        },
        {
          path: "groups/:groupId/update",
          action: updateGroupAction,
        },
      ],
    },
  ]);

  return (
    <ThemeProvider>
      <UserContextProvider>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </UserContextProvider>
    </ThemeProvider>
  );
}

export default App;
