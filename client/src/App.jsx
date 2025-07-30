import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* The Navbar will appear on every page */}
      <Navbar />

      {/* The <main> section is where the page content will be rendered */}
      <main className="container mx-auto p-4">
        <Routes>
          {/* This tells the app: when the URL is "/", show the HomePage component */}
          <Route path="/" element={<HomePage />} />

          {/* When the URL is "/login", show the LoginPage component */}
          <Route path="/login" element={<LoginPage />} />

          {/* When the URL is "/register", show the RegisterPage component */}
          <Route path="/register" element={<RegisterPage />} />

          {/* A catch-all route for any URL that doesn't match the ones above */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
