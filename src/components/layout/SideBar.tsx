import { NavLink } from "react-router-dom";
import {
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  WrenchScrewdriverIcon,
  Cog6ToothIcon,
  HomeModernIcon,
  InboxStackIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import RenovoLogo from "../../assets/images/FV_3RENOVO.png";

const navItems = [
  {
    to: "/app/tickets",
    icon: <ClipboardDocumentListIcon className="h-6 w-6" />,
  },

  {
    to: "/app/technicians",
    icon: <WrenchScrewdriverIcon className="h-6 w-6" />,
  },
  {
    to: "/app/providers",
    icon: <HomeModernIcon className="h-6 w-6" />,
  },
  {
    to: "/app/categories",
    icon: <TableCellsIcon className="h-6 w-6" />,
  },
  {
    to: "/app/products",
    icon: <InboxStackIcon className="h-6 w-6" />,
  },
  { to: "/app/invoices", icon: <DocumentTextIcon className="h-6 w-6" /> },
  { to: "/app/settings", icon: <Cog6ToothIcon className="h-6 w-6" /> },
];

export const Sidebar: React.FC = () => {
  return (
    <aside
      className="
        fixed top-0 left-0 h-screen w-20
        bg-white shadow-[4px_0_15px_rgba(0,0,0,0.06)]
        flex flex-col items-center py-5 z-50
      "
    >
      {/* Logo circular minimal */}
      <div className="mb-8">
        <img
          src={RenovoLogo}
          alt={`Renovo Logo`}
          className="w-full h-12 object-cover"
        />
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-6 flex-1 ">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `
                group flex items-center justify-center
                h-12 w-12 rounded-xl mx-auto
                transition-all duration-200
                ${
                  isActive
                    ? "bg-persian-red-100 text-persian-red-600 shadow-sm"
                    : "text-gray-500 hover:bg-persian-red-50 hover:text-persian-red-600"
                }
              `
            }
          >
            {item.icon}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
