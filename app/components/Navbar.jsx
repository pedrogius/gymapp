import { Link } from "remix";

const Navbar = ({ user }) => {
  return (
    <nav className="fixed inset-x-0 bottom-0 flex justify-between font-mono text-sm uppercase bg-stone-100 text-slate-700">
      <Link
        className="block w-full px-3 py-5 text-center transition duration-300 hover:bg-neutral-300"
        to="/"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        Home
      </Link>
      <Link
        className="block w-full px-3 py-5 text-center transition duration-300 hover:bg-neutral-300"
        to={user ? "/profile" : "/login"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {user ? "Mi Cuenta" : "Ingresar"}
      </Link>
      <Link
        className="block w-full px-3 py-5 text-center transition duration-300 hover:bg-neutral-300"
        to="/help"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Clases
      </Link>
    </nav>
  );
};

export default Navbar;
