import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "./pages/Auth";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;

