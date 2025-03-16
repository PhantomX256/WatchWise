import { Route, Routes } from "react-router-dom";
import Hero from "./pages/Hero";
import AuthLayout from "./components/ui/AuthLayout";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/ui/DashboardLayout";
import Search from "./pages/Search";
import Details from "./pages/Details";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route element={<AuthLayout />}>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
      </Route>
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/search" element={<Search />} />
        <Route path="/movie/:id" element={<Details />} />
      </Route>
    </Routes>
  );
};

export default App;
