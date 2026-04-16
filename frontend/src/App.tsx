import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Employees from "./pages/Employees";
import Product from "./pages/Product";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

const LayoutWrapper = () => (
  <Layout>
    <Outlet />
  </Layout>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route element={<LayoutWrapper />}>
          <Route path="/employees" element={<Employees />} />
          <Route path="/products" element={<Product />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
