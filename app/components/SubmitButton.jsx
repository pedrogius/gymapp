import { useTransition } from "remix";

const SubmitButton = ({ buttonText, submittingText = "Cargando..." }) => {
  const transition = useTransition();
  let busy = transition.state === "submitting";
  return (
    <button
      type="submit"
      disabled={busy}
      className="flex justify-center w-full px-4 py-2 font-bold text-white bg-indigo-600 border border-transparent rounded-md shadow-md text-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      {busy ? submittingText : buttonText}
    </button>
  );
};

export default SubmitButton;
