const Input = ({ placeholder, name, initialValue = "", error, ...args }) => {
  const validationError = error?.fieldErrors[name];
  return (
    <div className="relative">
      <input
        id={name}
        name={name}
        placeholder={placeholder}
        className="w-full h-10 text-gray-900 placeholder-transparent border-b-2 border-gray-300 peer focus:outline-none focus:border-indigo-600"
        defaultValue={initialValue}
        {...args}
      />
      <label
        htmlFor={name}
        className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
      >
        {placeholder}
      </label>
      {validationError && (
        <p className="text-xs text-red-700" role="alert">
          {validationError}
        </p>
      )}
    </div>
  );
};

export default Input;
