import React from 'react';
import { NavLink } from 'react-router-dom';

const Nav = () => {
  return (
    <nav className="bg-white shadow-md py-4 px-8 fixed top-0 left-0 right-0 z-50">
      <ul className="flex gap-8 list-none m-0 p-0 justify-center">
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-gray-700 no-underline text-lg font-medium px-4 py-2 rounded-md transition-all duration-200 hover:bg-gray-100 ${
                isActive ? 'text-blue-600 bg-blue-50' : ''
              }`
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/template"
            className={({ isActive }) =>
              `text-gray-700 no-underline text-lg font-medium px-4 py-2 rounded-md transition-all duration-200 hover:bg-gray-100 ${
                isActive ? 'text-blue-600 bg-blue-50' : ''
              }`
            }
          >
            Template
          </NavLink>
        </li>
        {/* <li>
          <NavLink
            to="/map"
            className={({ isActive }) =>
              `text-gray-700 no-underline text-lg font-medium px-4 py-2 rounded-md transition-all duration-200 hover:bg-gray-100 ${
                isActive ? 'text-blue-600 bg-blue-50' : ''
              }`
            }
          >
            Mapping
          </NavLink>
        </li> */}
      </ul>
    </nav>
  );
};

export default Nav;
