import { CheckLine } from "lucide-react";
import { LuShoppingCart, LuSquareUserRound } from "react-icons/lu";
import { Link, NavLink } from "react-router-dom";
import { useSidebar } from "../hooks/useSidebar";

const navItems = [
  {
    label: "Employees",
    path: "/employees",
    icon: <LuSquareUserRound size={24} />,
  },
  {
    label: "Products",
    path: "/products",
    icon: <LuShoppingCart size={24} />,
  },
  {
    label: "Tasks",
    path: "/tasks",
    icon: <CheckLine size={24} />,
  },
];

const Sidebar = () => {
  const { isSidebarOpen } = useSidebar();

  return (
    <aside
      className={`sidebar fixed top-0 left-0 z-9 flex h-screen flex-col overflow-y-auto border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-800 dark:bg-black lg:static ${
        isSidebarOpen
          ? "translate-x-0 w-[290px] px-5"
          : "-translate-x-full w-[290px] px-5 lg:translate-x-0 lg:w-[72px] lg:px-2.5 lg:overflow-hidden"
      }`}
    >
      <div
        className={`sidebar-header flex items-center gap-2 pt-8 pb-7 ${isSidebarOpen ? "justify-between" : "justify-center"}`}
      >
        <Link to="/">
          <span className={`logo ${isSidebarOpen ? "" : "hidden"}`}>
            <img
              className="dark:hidden"
              src="https://demo.tailadmin.com/src/images/logo/logo.svg"
              alt="Logo"
            />
            <img
              className="hidden dark:block"
              src="https://demo.tailadmin.com/src/images/logo/logo-dark.svg"
              alt="Logo"
            />
          </span>
          <span className={`logo-icon ${isSidebarOpen ? "hidden" : ""}`}>
            <img
              src="https://demo.tailadmin.com/src/images/logo/logo-icon.svg"
              alt="Logo"
            />
          </span>
        </Link>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav>
          <div>
            <h3 className="mb-4 text-xs leading-[20px] text-gray-400 uppercase">
              <span className="menu-group-title dark:text-white/90">MENU</span>
            </h3>
            <ul className="mb-6 flex flex-col gap-1">
              {navItems.map((item, index) => {
                return (
                  <li key={index}>
                    <NavLink
                      className={({ isActive }) =>
                        `menu-item group ${isActive ? "menu-item-active" : "menu-item-inactive"}`
                      }
                      to={item.path}
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={
                              isActive
                                ? "menu-item-active"
                                : "menu-item-inactive"
                            }
                          >
                            {item.icon}
                          </span>
                          <span
                            className={`menu-item-text ${isSidebarOpen ? "" : "hidden"}`}
                          >
                            {item.label}
                          </span>
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
