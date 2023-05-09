import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "./pages/Auth";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";
import Navigation from "./components/Navigation/Navigation";

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/auth" />}
          />
          <Route
            path="/auth"
            element={<AuthPage />}
          />
          <Route
            path="/events"
            element={<EventsPage />}
          />
          <Route
            path="/bookings"
            element={<BookingsPage />}
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;

