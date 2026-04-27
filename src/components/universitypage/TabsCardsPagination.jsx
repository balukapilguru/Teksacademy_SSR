"use client";

export default function TabsCardsPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center mt-6">
      {/* Arrows */}
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          {"<"}
        </button>

        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          {">"}
        </button>
      </div>

      {/* Dots */}
      <div className="flex gap-2 mt-4">
        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1;
          return (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={`w-3 h-3 rounded-full ${
                currentPage === page ? "bg-[#ba3148]" : "bg-gray-300"
              }`}
            ></button>
          );
        })}
      </div>
    </div>
  );
}

