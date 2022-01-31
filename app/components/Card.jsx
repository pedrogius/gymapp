const Card = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center max-w-xs p-5 mt-16 border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 bg-stone-100">
      {children}
    </div>
  );
};

export default Card;
