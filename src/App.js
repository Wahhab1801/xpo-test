import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import UserView from "./pages/UserView";
import AdminViewV2 from "./pages/AdminView";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link
                  to="/"
                  className="flex items-center px-4 text-gray-900 hover:text-gray-600 transition-colors"
                >
                  User View
                </Link>
                <Link
                  to="/admin"
                  className="flex items-center px-4 text-gray-900 hover:text-gray-600 transition-colors"
                >
                  Admin View
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<UserView />} />
            <Route path="/admin" element={<AdminViewV2 />} />
          </Routes>
        </main>
      </div>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
