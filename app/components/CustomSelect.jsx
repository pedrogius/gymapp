import Select from "react-select";

const CustomSelect = ({ name, error, ...args }) => {
  const validationError = error?.fieldErrors[name];
  return (
    <div>
      <Select {...args} name={name} />
      {validationError && (
        <p className="text-xs text-red-700" role="alert">
          {validationError}
        </p>
      )}
    </div>
  );
};

export default CustomSelect;
