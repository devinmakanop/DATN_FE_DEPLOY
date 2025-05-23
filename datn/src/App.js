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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="admin" element={<Admin />}>
          <Route path="locations" element={<AdminLocations />} />
          <Route path="locations/create" element={<AdminLocationCreate />} />

          <Route path="residenceGuide" element={<ResidenceGuideAdmin />} />
          <Route path="residenceGuide/create" element={<ResidenceGuideCreate />} />

          <Route path="restaurant" element={<RestaurantAdmin />} />
          <Route path="restaurant/create" element={<RestaurantCreate />} />

          <Route path="travelAgency" element={<TravelAgencyAdmin />} />
          <Route path="travelAgency/create" element={<AddTravelAgency />} />

          <Route path="accommodations" element={<AdminAccommodation />} />

        </Route>
        <Route path="/" element={<Client />}>
          <Route path="/locations" element={<ClientLocations />} />

          <Route path="/restaurants" element={<ClientRestaurants />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />

          <Route path="/residenceGuides" element={<ClientResidencyGuides />} />
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