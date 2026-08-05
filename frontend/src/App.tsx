import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import CartProvider from "./features/cart/context/CartProvider";
import AdminRoute from "./components/routes/AdminRoute";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import PublicRoute from "./components/routes/PublicRoute";
import { Toaster } from "./components/ui/toast";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Product from "./pages/Product";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Users from "./pages/Users";
import Courses from "./pages/Courses";
import TaskList from "./pages/TaskList";
import TaskListProvider from "./features/task-list/context/TaskListProvider";
import { useInactivitySignOut } from "./features/authentication/hooks/useInactivitySignOut";

const LayoutWrapper = () => (
  <ProtectedRoute>
    <CartProvider>
      <Layout>
        <Outlet />
      </Layout>
    </CartProvider>
  </ProtectedRoute>
);

// Rendered inside BrowserRouter because the sign-out redirect needs
// useNavigate.
const InactivitySignOut = () => {
  useInactivitySignOut();
  return null;
};

function App() {
  return (
    <BrowserRouter>
      <InactivitySignOut />
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <Signin />
            </PublicRoute>
          }
        />
        <Route element={<LayoutWrapper />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route
            path="/users"
            element={
              <AdminRoute>
                <Users />
              </AdminRoute>
            }
          />
          <Route path="/products" element={<Product />} />
          <Route path="/courses" element={<Courses />} />
          <Route
            path="/tasks"
            element={
              <TaskListProvider>
                <TaskList />
              </TaskListProvider>
            }
          />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
