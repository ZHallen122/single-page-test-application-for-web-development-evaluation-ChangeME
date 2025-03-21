import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // For demonstration purposes, this flag simulates authentication status.
  // In a real application, this state might come from a global auth context.
  const isAuthenticated = false;

  // Navigation items to be displayed in the header.
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Challenges", path: "/challenges" },
    { label: "Feedback", path: "/feedback" },
  ];

  // If the user is authenticated, add an Admin link.
  if (isAuthenticated) {
    navItems.push({ label: "Admin", path: "/admin" });
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link to="/" className="flex-shrink-0">
            {/* Placeholder logo image from picsum.photos */}
            <img
              src="https://picsum.photos/50/50"
              alt="Logo"
              className="h-10 w-10 rounded-full"
            />
            {/* Alternatively, use text as a logo:
            <span className="text-[28px] font-bold text-[#4A90E2] font-sans">
              WebDev Eval
            </span> */}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-gray-700 hover:text-[#4A90E2] transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <Link
                to="/login"
                className="text-gray-700 hover:text-[#4A90E2] transition-colors duration-200 font-medium"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              className="text-gray-700 hover:text-[#4A90E2] transition-colors duration-200 focus:outline-none"
            >
              {isMobileMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu with animation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-gray-700 hover:text-[#4A90E2] transition-colors duration-200 font-medium"
                >
                  {item.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-gray-700 hover:text-[#4A90E2] transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;