import React from "react";
import Link from "next/link";
import {
  LogIn,
  UserPlus,
  Info,
  Image as GalleryIcon,
  MapPin,
  Mail,
  Phone,
  Github,
  Chrome,
} from "lucide-react";

const menuLinks = [
  { href: "/about-us", label: "About Us", icon: Info },
  { href: "/gallery", label: "Gallery", icon: GalleryIcon },
  { href: "/visit", label: "Visit", icon: MapPin },
];

const authMethods = {
  login: [
    { id: "email", label: "Email", icon: Mail },
    { id: "phone", label: "Phone", icon: Phone },
    { id: "google", label: "Google", icon: Chrome },
  ],
  signup: [
    { id: "email", label: "Email", icon: Mail },
    { id: "phone", label: "Phone", icon: Phone },
    { id: "google", label: "Google", icon: Chrome },
    { id: "github", label: "Github", icon: Github },
  ],
};

const AuthSection = ({ type, onMethodClick }) => {
  const methods = authMethods[type.toLowerCase()];
  const Icon = type === "login" ? LogIn : UserPlus;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-2 py-1.5">
        <Icon className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-medium text-white">{type}</span>
      </div>
      <div className="space-y-1">
        {methods.map(({ id, label, icon: MethodIcon }) => (
          <button
            key={id}
            onClick={() => onMethodClick(type, id)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
          >
            <MethodIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
            <span className="text-sm text-gray-400 group-hover:text-gray-300">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

const Menu = () => {
  const handleAuthMethodClick = (type, method) => {
    console.log(`${type} with ${method}`);
    // Handle authentication method click
  };

  return (
    <div className="bg-gray-900/95 backdrop-blur-lg rounded-lg border border-white/10 overflow-hidden divide-y divide-white/10">
      {/* Auth Sections */}
      <div className="p-2 space-y-2">
        <AuthSection type="Login" onMethodClick={handleAuthMethodClick} />
      </div>
      <div className="p-2 space-y-2">
        <AuthSection type="Signup" onMethodClick={handleAuthMethodClick} />
      </div>

      {/* Navigation Links */}
      <div className="p-2 space-y-1">
        {menuLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
          >
            <Icon className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
            <span className="text-sm text-gray-400 group-hover:text-gray-300">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Menu;
