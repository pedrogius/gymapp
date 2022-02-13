import { useTransition } from "remix";

const DeleteButton = ({ buttonText, submittingText = "Cargando..." }) => {
  const transition = useTransition();
  let busy = transition.state === "submitting";
  return (
    <button
      type="submit"
      disabled={busy}
      className="flex justify-center w-full px-4 py-2 font-bold text-white border border-transparent rounded-md shadow-md bg-rose-600 text-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
    >
      {busy ? submittingText : buttonText}
    </button>
  );
};

export default DeleteButton;
