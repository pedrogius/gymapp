function CustomLink({ to, linkText }) {
  return (
    <a
      href={to}
      className="block mt-4 text-sm font-medium text-center text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
    >
      {linkText}
    </a>
  );
}

export default CustomLink;
