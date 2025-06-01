import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import AdminLocations from './component/admin/locations/index';
import AdminLocationCreate from './component/admin/locations/create';
import Admin from './component/admin';
import ResidenceGuideAdmin from './component/admin/residenceGuide/index';
import ResidenceGuideCreate from './component/admin/residenceGuide/create';
import RestaurantAdmin from './component/admin/restaurant';
import RestaurantCreate from './component/admin/restaurant/create';
import TravelAgencyAdmin from './component/admin/travelAgency';
import AddTravelAgency from './component/admin/travelAgency/create';
import ClientLocations from './component/client/location';
import Client from './component/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import ClientRestaurants from './component/client/restautant/index';
import RestaurantDetail from './component/client/restautant/detail';
import ClientResidencyGuides from './component/client/residenceGuide';
import ClientTravelAgency from './component/client/travelAgency';
import TravelAgencyDetail from './component/client/travelAgency/TravelAgencyDetail';
import AccommodationList from './component/client/accommodations';
import AdminAccommodation from './component/admin/accommodations';
import AccommodationDetail from './component/client/accommodations/detail';
import AIAnswer from './component/client/AI';
import AdminLocationDetail from './component/admin/locations/detail';
import ResidenceGuideDetail from './component/admin/residenceGuide/detail';
import LocationDetail from './component/client/location/detail';
import LoginClient from './component/client/Login/Login';
import RegisterClient from './component/client/register';
import ClientResidencyGuideDetail from './component/client/residenceGuide/detail';
import PrivateRoute from './component/admin/middleware/auth.middleware';
import LoginAdmin from './component/admin/login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="admin/login" element={<LoginAdmin />} />
        <Route path="admin" element={<Admin />}>
          <Route element={<PrivateRoute />}>
            <Route path="locations" element={<AdminLocations />} />
            <Route path="locations/create" element={<AdminLocationCreate />} />
            <Route path="locations/detail/:id" element={<AdminLocationDetail />} />

            <Route path="residenceGuide" element={<ResidenceGuideAdmin />} />
            <Route path="residenceGuide/create" element={<ResidenceGuideCreate />} />
            <Route path="residenceGuide/detail/:id" element={<ResidenceGuideDetail />} />

            <Route path="restaurant" element={<RestaurantAdmin />} />
            <Route path="restaurant/create" element={<RestaurantCreate />} />

            <Route path="travelAgency" element={<TravelAgencyAdmin />} />
            <Route path="travelAgency/create" element={<AddTravelAgency />} />

            <Route path="accommodations" element={<AdminAccommodation />} />
          </Route>
        </Route>

        <Route path="/login" element={<LoginClient />} />
        <Route path="/register" element={<RegisterClient />} />

        <Route path="/" element={<Client />}>
          <Route path="/AI" element={<AIAnswer />} />
          <Route path="/locations" element={<ClientLocations />} />
          <Route path="/locations/:id" element={<LocationDetail />} />

          <Route path="/restaurants" element={<ClientRestaurants />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />

          <Route path="/residenceGuides" element={<ClientResidencyGuides />} />
          <Route path="/residenceGuide/:id" element={<ClientResidencyGuideDetail />} />
          <Route path="/travelAgency" element={<ClientTravelAgency />} />
          <Route path="/travelAgency/:id" element={<TravelAgencyDetail />} />

          <Route path="/accommodations" element={<AccommodationList />} />
          <Route path="accommodations/:id" element={<AccommodationDetail />} />

        </Route>
      </Routes>
    </BrowserRouter >
  );
}

export default App;