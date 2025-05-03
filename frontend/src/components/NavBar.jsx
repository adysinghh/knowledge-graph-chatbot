import React from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

export default function NavBar({ cartCount, onToggleCart }) {
  return (
    <header className="nav-gradient text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <h1 className="text-2xl font-bold">Freelancer Finder</h1>
      <button
        onClick={onToggleCart}
        className="relative p-2 hover:text-gray-200"
        aria-label="Toggle Cart"
      >
        <ShoppingCartIcon className="h-6 w-6" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {cartCount}
          </span>
        )}
      </button>
    </header>
  );
}
