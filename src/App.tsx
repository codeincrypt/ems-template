import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import { Toaster } from "@components/ui/toaster";
import { Toaster as Sonner } from "@components/ui/sonner";
import { TooltipProvider } from "@components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import MainLayout from "./components/layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import EmployeeProfile from "./pages/EmployeeProfile";
import Tasks from "./pages/Tasks";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Payroll from "./pages/Payroll";
import Recruitment from "./pages/Recruitment";
import Performance from "./pages/Performance";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Documents from "./pages/Documents";
import Sprints from "./pages/Sprints";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890ff',
            borderRadius: 8,
          },
        }}
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/employees" element={<Employees />} />
                        <Route path="/employees/:id" element={<EmployeeProfile />} />
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/sprints" element={<Sprints />} />
                        <Route path="/attendance" element={<Attendance />} />
                        <Route path="/leave" element={<Leave />} />
                        <Route path="/payroll" element={<Payroll />} />
                        <Route path="/recruitment" element={<Recruitment />} />
                        <Route path="/performance" element={<Performance />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/documents" element={<Documents />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ConfigProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
