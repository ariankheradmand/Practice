import React, { useEffect, useState } from "react";
import Menu from "@/components/Menu";
import Searchabar from "./Searchabar";
import Link from "next/link";
import {
  Home,
  TrendingUp,
  Heart,
  Grid,
  Search,
  Bell,
  Sparkles,
  Clock,
  Menu as MenuIcon,
  X,
  Film,
  Tv,
  Ticket,
} from "lucide-react";
import { useWatchlist } from "@/contexts/WatchlistContext";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [endOfPage, setEndOfPage] = useState(false);
  const [openSearchBar, setOpenSearchBar] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const { count: watchlistCount } = useWatchlist();

  const toggleSearchBar = () => {
    setOpenSearchBar(!openSearchBar);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    if (showCategoriesDropdown) setShowCategoriesDropdown(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (openSearchBar) setOpenSearchBar(false);
    if (showCategoriesDropdown) setShowCategoriesDropdown(false);
  };

  const toggleCategoriesDropdown = () => {
    setShowCategoriesDropdown(!showCategoriesDropdown);
    if (openSearchBar) setOpenSearchBar(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold =
        document.documentElement.scrollHeight || document.body.offsetHeight;
      setEndOfPage(scrollPosition >= threshold - 60);
    };

    window.addEventListener("scroll", handleScroll);

    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (
        showCategoriesDropdown &&
        !event.target.closest(".categories-dropdown")
      ) {
        setShowCategoriesDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCategoriesDropdown]);

  const navLinks = [
    { Icon: Home, label: "Home", href: "/", active: true },
    {
      Icon: TrendingUp,
      label: "Trending",
      href: "/movies/category/trending",
      notificationCount: 3,
    },
    {
      Icon: Heart,
      label: "Watchlist",
      href: "/watchlist",
      notificationCount: watchlistCount > 0 ? watchlistCount : null,
    },
    { Icon: Grid, label: "Categories", href: "#", dropdown: true },
  ];

  const categoryDropdownItems = [
    { icon: Film, label: "Movies", href: "/movies" },
    { icon: Tv, label: "TV Shows", href: "/tv" },
    { icon: Ticket, label: "Genres", href: "/genres" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full py-2">
      <div
        className={`
          w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
          transition-all duration-500 ease-out
          ${
            endOfPage
              ? " bg-gray-900/95"
              : isScrolled
              ? "translate-y-0 bg-gray-900/80 backdrop-blur-lg shadow-lg"
              : "translate-y-4 bg-transparent"
          }
        `}
      >
        <div className="relative flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-40 group-hover:opacity-75 transition duration-200"></div>
                <div className="relative flex items-center space-x-2 bg-black rounded-lg px-3 py-1.5">
                  <Sparkles className="w-5 h-5 text-pink-500 shrink-0" />
                  <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                    AR
                  </span>
                  <span className="text-sm font-medium text-white/90">2</span>
                  <div className="h-4 w-px bg-gray-700/50 mx-1"></div>
                  <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-xs text-gray-400 font-mono whitespace-nowrap">
                    {currentTime.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 mx-4">
            {navLinks.map((link, index) => (
              <React.Fragment key={index}>
                {link.dropdown ? (
                  <div className="categories-dropdown relative">
                    <button
                      onClick={toggleCategoriesDropdown}
                      className={`
                        relative group flex items-center space-x-2 px-3 py-2 rounded-lg
                        transition-all duration-200
                        ${
                          showCategoriesDropdown
                            ? "bg-white/10"
                            : "hover:bg-white/5"
                        }
                      `}
                    >
                      <div className="relative">
                        <link.Icon
                          className={`w-4 h-4 transition-all duration-200 ${
                            showCategoriesDropdown
                              ? "text-purple-400"
                              : "text-gray-400 group-hover:text-white"
                          }`}
                          strokeWidth={2}
                        />
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          showCategoriesDropdown
                            ? "text-white"
                            : "text-gray-400 group-hover:text-white"
                        }`}
                      >
                        {link.label}
                      </span>
                    </button>

                    {showCategoriesDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-gray-900/95 backdrop-blur-lg rounded-lg shadow-lg border border-white/10 overflow-hidden">
                        {categoryDropdownItems.map((item, i) => (
                          <Link
                            key={i}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"
                            onClick={() => setShowCategoriesDropdown(false)}
                          >
                            <item.icon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-white">
                              {item.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink {...link} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-4 hidden sm:block">
            <Searchabar
              isScrolled={isScrolled}
              endOfPage={endOfPage}
              openSearchBar={openSearchBar}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Search Toggle */}
            <button
              onClick={toggleSearchBar}
              className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200 group relative"
              aria-label="Toggle search"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <Search
                className="w-4 h-4 transition-transform duration-200 group-hover:scale-110 text-gray-300"
                strokeWidth={2}
              />
            </button>

            {/* Notifications */}
            <button className="hidden sm:flex p-2 rounded-lg hover:bg-white/10 transition-all duration-200 group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <div className="relative">
                <Bell
                  className="w-4 h-4 transition-transform duration-200 group-hover:scale-110 text-gray-300"
                  strokeWidth={2}
                />
                <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-semibold text-white">
                  2
                </span>
              </div>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-all duration-200 group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-300" />
              ) : (
                <MenuIcon className="w-5 h-5 text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link, index) => (
                <React.Fragment key={index}>
                  {link.dropdown ? (
                    <>
                      <button
                        onClick={toggleCategoriesDropdown}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-200"
                      >
                        <div className="flex items-center">
                          <link.Icon
                            className="w-5 h-5 text-gray-400"
                            strokeWidth={2}
                          />
                          <span className="ml-3 text-base font-medium text-gray-400">
                            {link.label}
                          </span>
                        </div>
                        <span className="text-gray-400">
                          {showCategoriesDropdown ? "−" : "+"}
                        </span>
                      </button>

                      {showCategoriesDropdown && (
                        <div className="ml-10 mt-1 space-y-1">
                          {categoryDropdownItems.map((item, i) => (
                            <Link
                              key={i}
                              href={item.href}
                              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
                              onClick={() => {
                                setShowCategoriesDropdown(false);
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              <item.icon className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-400">
                                {item.label}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <MobileNavLink {...link} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Search Bar */}
      {openSearchBar && (
        <div className="sm:hidden fixed inset-x-0 top-20 px-4 z-50">
          <div className="bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-xl border border-white/10 p-4 overflow-visible">
            <Searchabar
              isScrolled={isScrolled}
              endOfPage={endOfPage}
              openSearchBar={openSearchBar}
            />
          </div>
        </div>
      )}
    </nav>
  );
}

// Navigation Link Component
const NavLink = ({ Icon, label, href, active, notificationCount }) => (
  <Link
    href={href}
    className={`
      relative group flex items-center space-x-2 px-3 py-2 rounded-lg
      transition-all duration-200
      ${active ? "bg-white/10" : "hover:bg-white/5"}
    `}
  >
    <div className="relative">
      <Icon
        className={`w-4 h-4 transition-all duration-200 ${
          active ? "text-purple-400" : "text-gray-400 group-hover:text-white"
        }`}
        strokeWidth={2}
      />
      {notificationCount && (
        <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 bg-purple-500 rounded-full flex items-center justify-center text-[8px] font-semibold text-white">
          {notificationCount}
        </span>
      )}
    </div>
    <span
      className={`text-sm font-medium ${
        active ? "text-white" : "text-gray-400 group-hover:text-white"
      }`}
    >
      {label}
    </span>
    {active && (
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"></span>
    )}
  </Link>
);

// Mobile Navigation Link Component
const MobileNavLink = ({ Icon, label, href, active, notificationCount }) => (
  <Link
    href={href}
    className={`
      flex items-center px-3 py-2 rounded-lg
      transition-all duration-200
      ${active ? "bg-white/10" : "hover:bg-white/5"}
    `}
  >
    <div className="relative">
      <Icon
        className={`w-5 h-5 ${active ? "text-purple-400" : "text-gray-400"}`}
        strokeWidth={2}
      />
      {notificationCount && (
        <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-purple-500 rounded-full flex items-center justify-center text-[10px] font-semibold text-white">
          {notificationCount}
        </span>
      )}
    </div>
    <span
      className={`ml-3 text-base font-medium ${
        active ? "text-white" : "text-gray-400"
      }`}
    >
      {label}
    </span>
  </Link>
);

export default Navbar;
