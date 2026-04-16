import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import Layout from "./Layout";
import Signup from "./authentication/Signup";
import Product from "./pages/Product";
import Employees from "./pages/Employees";

const LayoutWrapper = () => (
  <Layout>
    <Outlet />
  </Layout>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route element={<LayoutWrapper />}>
          <Route path="/employees" element={<Employees />} />
          <Route path="/products" element={<Product />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
