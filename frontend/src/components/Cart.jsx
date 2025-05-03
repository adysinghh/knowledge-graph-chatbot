import React from "react";

export default function Cart({ items }) {
  return (
    <div className="p-4">
      <h2 className="font-bold mb-2">Cart</h2>
      {items.length === 0
        ? <p>No freelancers selected.</p>
        : <ul>
            {items.map((f,i) => (
              <li key={i} className="border-b py-2">
                <p><strong>{f.name}</strong> (${f.rate}/hr)</p>
                <a href={f.portfolio}
                   className="underline"
                   target="_blank"
                   rel="noopener noreferrer">
                  View Portfolio
                </a>
              </li>
            ))}
          </ul>}
    </div>
  );
}
