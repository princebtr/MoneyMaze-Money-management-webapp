import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./utils/authContext";
import LandingPage from "./pages/landing/landingPage";
import FinancialPlanner from "./pages/financial/financialPlanner";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import Dashboard from "./pages/dashboard2/dashboard";
import PageNotImplemented from "./pages/pageEmpty";
import DashboardPage from "./pages/dashboard";
import CommonHeader from "./Components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Debt from "./pages/debt-management/debt";
import FinancialDashboard from "./pages/financial_dashboard/FinancialDashboard";
import FinancialHealthDashboard from "./pages/financial_dashboard/financial-health";
import FinancialReports from "./pages/financial_dashboard/Reports-dashboard";
import RecurringTransactions from "./pages/Transactions/RecurringTransaction";

const BlankLayout = () => {
  return (
    <>
      <CommonHeader />
      <main>
        <div className="bg-overlay"></div>
        <Outlet />
        <ToastContainer />
      </main>
    </>
  );
};

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <BlankLayout />,
      children: [
        {
          path: "/",
          element: <LandingPage />,
        },
        {
          path: "/financial",
          element: <FinancialPlanner />,
        },
        {
          path: "/Recurring_Transaction",
          element: <RecurringTransactions />,
        },
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/register",
          element: <RegisterPage />,
        },
        {
          path: "/dashboard",
          element: <DashboardPage />,
        },
        {
          path: "/dashboard2",
          element: <Dashboard />,
        },
        {
          path: "/contact",
          element: <main>Contact Us</main>,
        },
        {
          path: "/financial_dashboard",
          element: <FinancialDashboard />,
        },
        {
          path: "/health",
          element: <FinancialHealthDashboard />,
        },
        {
          path: "/basic-report",
          element: <FinancialReports />,
        },
        {
          path: "/services",
          element: <main>Services</main>,
        },
        {
          path: "/about",
          element: <main>About Us</main>,
        },
        {
          path: "/debt",
          element: <Debt />
        },
        {
          path: "*",
          element: <PageNotImplemented />,
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;