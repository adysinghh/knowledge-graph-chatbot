import React from "react";

export default function CartDropdown({ items, isOpen }) {
  return (
    <div
      className={`absolute right-6 top-16 w-64 bg-white border shadow-lg rounded-md transition-transform origin-top ${
        isOpen ? "scale-y-100" : "scale-y-0"
      }`}
      style={{ transformOrigin: "top" }}
    >
      <div className="p-4 border-b font-semibold">Your Cart</div>
      <ul className="max-h-64 overflow-auto">
        {items.length === 0 ? (
          <li className="p-4 text-gray-500">No freelancers added.</li>
        ) : (
          items.map((f, i) => (
            <li key={i} className="p-3 hover:bg-gray-100">
              <p className="font-medium">{f.name}</p>
              <p className="text-sm text-gray-600">${f.rate}/hr</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
