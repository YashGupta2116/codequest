"use client";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Navbarblock = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Navigation handlers
  const handleNavigation = (path) => {
    router.push(path);
  };

  const navItems = [
    {
      name: "Dashboard",
      link: "/dashboard",
      onClick: () => handleNavigation("/dashboard"),
    },
    {
      name: "Courses",
      link: "/courses",
      onClick: () => handleNavigation("/courses"),
    },
    {
      name: "Training",
      link: "/training",
      onClick: () => handleNavigation("/training"),
    },
    {
      name: "About us",
      link: "/about-us",
      onClick: () => handleNavigation("/about-us"),
    },
  ];

  const handleLogout = async () => {
    await signOut();
    router.push("/signin");
  };

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems
            items={navItems}
            onItemClick={(item) => {
              if (item.onClick) {
                item.onClick();
              }
            }}
          />
          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary">Level-10</NavbarButton>
            <div className="relative">
              <NavbarButton
                variant="gradient"
                className={
                  "rounded-4xl w-9 h-9 flex justify-center items-center"
                }
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
              >
                Al
              </NavbarButton>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-md border bg-white shadow-md dark:bg-neutral-900 dark:border-neutral-800 z-50 p-1">
                  <button
                    className="w-full flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 px-3 py-2 rounded-md hover:bg-black hover:text-white dark:hover:bg-black dark:hover:text-white transition-colors"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleNavigation("/dashboard");
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.866 0-7 3.134-7 7h2a5 5 0 0 1 10 0h2c0-3.866-3.134-7-7-7z" />
                    </svg>
                    Profile
                  </button>
                  <button
                    className="w-full flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400 px-3 py-2 rounded-md hover:bg-black dark:hover:bg-black transition-colors"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M10 17l5-5-5-5v10zm9-14H5a2 2 0 0 0-2 2v4h2V5h14v14H5v-4H3v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <button
                key={`mobile-link-${idx}`}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  }
                  setIsMobileMenuOpen(false);
                }}
                className="relative text-neutral-600 dark:text-neutral-300 text-left w-full"
              >
                <span className="block">{item.name}</span>
              </button>
            ))}

            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="secondary"
                className="w-full"
              >
                Login
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Book a call
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
};

export default Navbarblock;
