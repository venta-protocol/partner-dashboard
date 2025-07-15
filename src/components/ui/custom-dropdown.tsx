export const CustomDropdown = ({
  options,
  selectedOption,
  onSelect,
  isOpen,
  setIsOpen,
}: {
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
}) => {
  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-between px-4 py-2 text-2xl font-semibold bg-white rounded-md shadow-sm text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        {selectedOption}
        <svg
          className="w-5 h-5 ml-2 -mr-1 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 bg-white rounded-md shadow-lg w-20 ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {options.map((option) => (
              <div
                key={option}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
