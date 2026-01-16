import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage, { action as loginAction } from "./pages/LoginPage";
import SignupPage, { action as signupAction } from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import GroupDetails, {
  loader as groupDetailsLoader,
} from "./pages/GroupDetails";
import BillDetails from "./pages/BillDetails";
import ScanBill from "./pages/ScanBill";
import SidebarLayout from "./pages/SideBarLayout";
import { action as logoutAction } from "./pages/Logout";
import { ThemeProvider } from "./context/ThemeContext";
import RootPage from "./pages/RootPage";
import { Toaster } from "sonner";
import UserContextProvider from "./context/UserContext";
import SidebarContextProvider from "./context/SidebarContext";
import { loader as sidebarLoader } from "./components/Sidebar";
import { action as joinGroupAction } from "./components/JoinGroup";
import { action as createGroupAction } from "./components/CreateGroup";
import GroupPage, { loader as groupPageLoader } from "./pages/GroupPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootPage />,
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
        {
          path: "logout",
          action: logoutAction,
        },
        {
          element: <SidebarLayout />,
          loader: sidebarLoader,
          children: [
            {
              path: "home",
              element: <HomePage />,
            },
            {
              path: "analytics",
              element: <AnalyticsPage />,
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
              path: "bill/:billId",
              element: <BillDetails />,
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
      ],
    },
  ]);

  return (
    <ThemeProvider>
      <UserContextProvider>
        <SidebarContextProvider>
          <RouterProvider router={router} />
          <Toaster richColors position="top-right" />
        </SidebarContextProvider>
      </UserContextProvider>
    </ThemeProvider>
  );
}

export default App;
