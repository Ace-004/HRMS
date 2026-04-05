import React, { useEffect, useState } from "react";
import Sidebar from "./layout/Sidebar";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSidebarOpen]);

  const toggleDesktopSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div
      className={`app-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
    >
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={closeMobileSidebar}
      />
      <div
        className="main-content"
        onClick={mobileSidebarOpen ? closeMobileSidebar : undefined}
      >
        <Navbar
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={toggleDesktopSidebar}
          onToggleMobileSidebar={toggleMobileSidebar}
        />
        <div className="page-content animate-in">{children}</div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
