import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import SMTP from "./Pages/SMTP";
import Sms from "./Pages/Sms";
import UserStatistics from './Pages/UserStatistics';
import Ad from './Pages/Ad';
import BlockWords from './Pages/BlockWords';
import Apps from './Pages/Apps';
import DataPolicy from './Pages/DataPolicy';
import Terms from './Pages/Terms';
import CreateApps from './Pages/sub-pages/CreateApps';
import CreateSMTP from './Pages/sub-pages/CreateSMTP';
import CreateSMS from './Pages/sub-pages/CreateSMS';
import CreateAd from './Pages/sub-pages/CreateAd';
import UpdateSMTP from './Pages/sub-pages/UpdateSMTP';
import ViewAd from './Pages/sub-pages/ViewAd';
import UpdateApps from './Pages/sub-pages/UpdateApps';
import ChangePassword from './Pages/ChangePassword';
import LoginPage from './Pages/LoginPage';
import UpdateSMS from './Pages/sub-pages/UpdateSMS';
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import LoginLogs from './Pages/LoginLogs';
import AppStatus from './Pages/AppStatus';
import UpdateStatus from './Pages/sub-pages/UpdateStatus';
import UpdateSubStatus from './Pages/sub-pages/UpdateSubStatus';
import Tickets from './Pages/Tickets';
import ViewTicketDetails from './Pages/sub-pages/ViewAppRequestDetails';
import AppRequest from './Pages/AppRequest';
import UpdateAppRequest from './Pages/sub-pages/UpdateAppRequest';
import ViewAppRequestDetails from './Pages/sub-pages/ViewAppRequestDetails';
import UpdateTicketStatus from './Pages/sub-pages/UpdateTicketStatus';
import States from './Pages/States';
import UpdateState from './Pages/sub-pages/UpdateState';
import UpdateCity from './Pages/sub-pages/UpdateCity';
import DiscountPolicy from './Pages/DiscountPolicy';
import UpdateDiscountPolicy from './Pages/sub-pages/UpdateDiscountPolicy';
import TaxManagement from './Pages/TaxManagement';
import UpdateTax from './Pages/sub-pages/UpdateTax';
import RateCreation from './Pages/RateCreation';
import AdTerms from './Pages/AdTerms';
import Customers from './Pages/Customers';
import useVersioning from './hooks/useVersioning';
import CustomerProfile from './Pages/CustomerProfile';

const PrivateRoute = ({ element }) => {
  const { auth } = useSelector((state) => state.auth);
  const isLogin = auth?.status;

  return isLogin ? element : <Navigate to="/login" replace />;
};


function App() {
  const { auth } = useSelector((state) => state.auth);
  const isLogin = auth?.status;
  useVersioning()

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute
                element={<Dashboard />}
                isLogin={isLogin}
              />
            }
          >
            <Route index element={<Apps />} />
            <Route path="apps" element={<Apps />} />
            <Route path="apps/create" element={<CreateApps />} />
            <Route path="apps/update/:id" element={<UpdateApps />} />
            <Route path="profile" element={<Profile />} />
            <Route path="customer-profile/:id" element={<CustomerProfile />} />
            <Route path="status" element={<AppStatus />} />
            <Route path="app-request" element={<AppRequest />} />
            <Route path="app-request/update/:id/:ticketNo/:statusId" element={<UpdateAppRequest />} />
            <Route path="app-request/details/:id" element={<ViewAppRequestDetails />} />
            <Route path="tax-management" element={<TaxManagement />} />
            <Route path="rate" element={<RateCreation />} />
            <Route path="tax-management/update/:id" element={<UpdateTax />} />
            <Route path="discount-policy" element={<DiscountPolicy />} />
            <Route path="discount-policy/update/:id" element={<UpdateDiscountPolicy />} />
            <Route path="states" element={<States />} />
            <Route path="states/update/:id" element={<UpdateState />} />
            <Route path="city/update/:id" element={<UpdateCity />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="tickets/update/:id/:ticketNo/:statusName/:statusId" element={<UpdateTicketStatus />} />
            <Route path="ticket/details/:id" element={<ViewTicketDetails />} />
            <Route path="status/update/:id" element={<UpdateStatus />} />
            <Route path="sub-status/update/:id" element={<UpdateSubStatus />} />
            <Route path="smtp" element={<SMTP />} />
            <Route path="smtp/create" element={<CreateSMTP />} />
            <Route path="smtp/update/:id" element={<UpdateSMTP />} />
            <Route path="sms" element={<Sms />} />
            <Route path="sms/create" element={<CreateSMS />} />
            <Route path="sms/update/:id" element={<UpdateSMS />} />
            <Route path="user-statistics" element={<UserStatistics />} />
            <Route path="ad" element={<Ad />} />
            <Route path="ad/create" element={<CreateAd />} />
            <Route path="ad/view/:id" element={<ViewAd />} />
            <Route path="ad/view/:adminAd/:id" element={<ViewAd />} />
            <Route path="block-words" element={<BlockWords />} />
            <Route path="data-policy" element={<DataPolicy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="ad-terms" element={<AdTerms />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="logs" element={<LoginLogs />} />
            <Route path="customers" element={<Customers />} />
          </Route>
          <Route path="login" element={<LoginPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
