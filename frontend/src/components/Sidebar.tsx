import { LuShoppingCart, LuSquareUserRound } from "react-icons/lu";
import { NavLink } from "react-router-dom";

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
];
const Sidebar = () => {
  return (
    <aside className="sidebar fixed top-0 left-0 z-9 flex h-screen w-[290px] flex-col overflow-y-auto border-r border-gray-200 bg-white px-5 transition-all duration-300 lg:static lg:translate-x-0 dark:border-gray-800 dark:bg-black -translate-x-full">
      <div className="sidebar-header flex items-center gap-2 pt-8 pb-7 justify-between">
        <a href="">
          <span className="logo">
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
        </a>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav>
          <div>
            <h3 className="mb-4 text-xs leading-[20px] text-gray-400 uppercase">
              <span className="menu-group-title">MENU</span>
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
                          <span className="menu-item-text">{item.label}</span>
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
