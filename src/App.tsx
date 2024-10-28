import { Layout } from 'antd';
import React, { useContext } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.scss';
import CreateMaaliForm from './components/maali/CreateMaaliForm';
import EditMaali from './components/maali/EditMaali';
import PlantsMasterData from './components/master-data/plants/PlantsMasterData';
import PotsPlantersMasterData from './components/master-data/pots-planters';
import ProductMasterData from './components/ProductMasterData';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import { AuthContext } from './context/AuthContext';
import AddProduct from './pages/AddProduct';
import Categories from './pages/Categories';
import Customers from './pages/Customers';
import Dashboard from './pages/Dashboard';
import Locations from './pages/Locations';
import Login from './pages/Login';
import Maali from './pages/Maali';
import MaaliBookings from './pages/MaaliBookings';
import Nurseries from './pages/Nurseries';
import Nursery from './pages/Nursery';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Services from './pages/Services';
import WebsiteContentManagement from './pages/WebsiteContentManagement';
import BlogList from './pages/BlogList';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import PlantDayCareMasterData from './components/master-data/plant-day-care';

const { Content } = Layout;

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/maalis" element={<ProtectedRoute><Maali /></ProtectedRoute>} />
    <Route path="/maalis/create" element={<ProtectedRoute><CreateMaaliForm /></ProtectedRoute>} />
    <Route path="/maalis/edit/:maaliId" element={<ProtectedRoute><EditMaali /></ProtectedRoute>} />
    <Route path="/nurseries" element={<ProtectedRoute><Nurseries /></ProtectedRoute>} />
    <Route path="/nurseries/:id" element={<ProtectedRoute><Nursery /></ProtectedRoute>} />
    <Route path="/orders/:type" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
    <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
    <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
    <Route path="/maali-bookings/:type" element={<ProtectedRoute><MaaliBookings /></ProtectedRoute>} />
    <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
    <Route path="/master-data/products" element={<ProtectedRoute><ProductMasterData /></ProtectedRoute>} />
    <Route path="/master-data/plants" element={<ProtectedRoute><PlantsMasterData /></ProtectedRoute>} />
    <Route path="/master-data/pots-planters" element={<ProtectedRoute><PotsPlantersMasterData /></ProtectedRoute>} />
    <Route path="/master-data/plant-day-care" element={<ProtectedRoute><PlantDayCareMasterData /></ProtectedRoute>} />
    <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
    <Route path="/products/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
    <Route path="/master-data/locations" element={<ProtectedRoute><Locations /></ProtectedRoute>} />
    <Route path="/website-content-management" element={<ProtectedRoute><WebsiteContentManagement /></ProtectedRoute>} />
    <Route path="/blogs" element={<ProtectedRoute><BlogList /></ProtectedRoute>} />
    <Route path="/blogs/create" element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
    <Route path="/blogs/edit/:id" element={<ProtectedRoute><EditBlog /></ProtectedRoute>} />
  </Routes>
);

const App: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const { user } = useContext(AuthContext);

  const handleCollapse = (collapsed: boolean) => setCollapsed(collapsed);

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        {user && <Sidebar collapsed={collapsed} onCollapse={handleCollapse} />}
        <Layout className="site-layout">
          <Content style={{ margin: '0 16px', overflow: 'initial' }}>
            <AppRoutes />
          </Content>
          {/* Uncomment if footer is needed */}
          {/* {user && <Footer style={{ textAlign: 'center' }}>Chaperone Shop Admin ©2024 Created by Your Company</Footer>} */}
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
