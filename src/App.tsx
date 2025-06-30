
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css';
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";
import Insights from "./pages/Insights";
import Onboarding from "./pages/Onboarding";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster"
import Subscription from "./pages/Subscription";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SubscriptionCancel from "./pages/SubscriptionCancel";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import DialogueSimulator from "./pages/DialogueSimulator";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/landing",
    element: <Landing />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/journal",
    element: <Journal />,
  },
  {
    path: "/insights",
    element: <Insights />,
  },
  {
    path: "/dialogue-simulator",
    element: <DialogueSimulator />,
  },
  {
    path: "/subscription",
    element: <Subscription />,
  },
  {
    path: "/subscription/success",
    element: <SubscriptionSuccess />,
  },
  {
    path: "/subscription/cancel",
    element: <SubscriptionCancel />,
  },
  {
    path: "/onboarding",
    element: <Onboarding />,
  },
  {
    path: "/terms-of-service",
    element: <TermsOfService />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
