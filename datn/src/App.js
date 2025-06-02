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
import AdminLocationUpdate from './component/admin/locations/update';
import AdminRestaurantEdit from './component/admin/restaurant/edit';
import AdminRestaurantDetail from './component/admin/restaurant/detail';
import TravelAgencyAdminEdit from './component/admin/travelAgency/edit';
import TravelAgencyAdminDetail from './component/admin/travelAgency/detail';
import AdminAccommodationCreate from './component/admin/accommodations/create';
import AdminAccommodationDetail from './component/admin/accommodations/detail';
import AdminAccommodationEdit from './component/admin/accommodations/edit';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="admin/login" element={<LoginAdmin />} />
          <Route element={<PrivateRoute />}>
        <Route path="admin" element={<Admin />}>
            <Route path="locations" element={<AdminLocations />} />
            <Route path="locations/create" element={<AdminLocationCreate />} />
            <Route path="locations/detail/:id" element={<AdminLocationDetail />} />
            <Route path="locations/edit/:id" element={<AdminLocationUpdate />} />

            <Route path="residenceGuide" element={<ResidenceGuideAdmin />} />
            <Route path="residenceGuide/create" element={<ResidenceGuideCreate />} />
            <Route path="residenceGuide/detail/:id" element={<ResidenceGuideDetail />} />

            <Route path="restaurant" element={<RestaurantAdmin />} />
            <Route path="restaurant/create" element={<RestaurantCreate />} />
            <Route path="restaurant/edit/:id" element={<AdminRestaurantEdit />} />
            <Route path="restaurant/detail/:id" element={<AdminRestaurantDetail />} />

            <Route path="travelAgency" element={<TravelAgencyAdmin />} />
            <Route path="travelAgency/create" element={<AddTravelAgency />} />
            <Route path="travelAgency/edit/:id" element={<TravelAgencyAdminEdit />} />
            <Route path="travelAgency/detail/:id" element={<TravelAgencyAdminDetail />} />

            <Route path="accommodations" element={<AdminAccommodation />} />
            <Route path="accommodations/create" element={<AdminAccommodationCreate />} />
            <Route path="accommodations/detail/:id" element={<AdminAccommodationDetail />} />
            <Route path="accommodations/edit/:id" element={<AdminAccommodationEdit />} />
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