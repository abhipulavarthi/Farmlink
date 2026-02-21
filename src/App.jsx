import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import UserHome from "./pages/UserHome";
import SellerDashboard from "./pages/SellerDashboard";
import SellerProfile from "./pages/SellerProfile";
import BuyerDashboard from "./pages/BuyerDashboard";
import Register from "./pages/Register";
import Recipes from "./pages/Recipes";
import Planting from "./pages/Planting";
import IntroFarm from "./pages/IntroFarm";
import IntroRecipes from "./pages/IntroRecipes";
import IntroPlanting from "./pages/IntroPlanting";

// Route Guards
const PrivateRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (!user) return <Navigate to="/" />;

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'seller' ? '/seller/dashboard' : '/'} />;
  }

  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            {/* Public Routes */}
            <Route path="/" element={<UserHome />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/planting" element={<Planting />} />
            <Route path="/intro-farm" element={<IntroFarm />} />
            <Route path="/intro-recipes" element={<IntroRecipes />} />
            <Route path="/intro-planting" element={<IntroPlanting />} />

            <Route path="/seller/:id" element={<SellerProfile />} />

            {/* Seller Routes */}
            <Route path="/seller/dashboard" element={
              <PrivateRoute allowedRole="seller">
                <SellerDashboard />
              </PrivateRoute>
            } />

            {/* Buyer Routes */}
            <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
