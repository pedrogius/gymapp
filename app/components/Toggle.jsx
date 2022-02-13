const Toggle = ({ children, checked, onChange }) => {
  return (
    <div className="flex">
      <div className="form-check form-switch">
        <input
          className="w-4 h-4 mr-2 text-indigo-500 border border-gray-300 rounded focus:ring-indigo-400 focus:ring-opacity-25"
          type="checkbox"
          role="switch"
          id="flexSwitchCheckDefault"
          name="remote"
          checked={checked}
          onChange={onChange}
        />
        <label
          className="inline-block text-gray-800 form-check-label"
          htmlFor="flexSwitchCheckDefault"
        >
          {children}
        </label>
      </div>
    </div>
  );
};

export default Toggle;
