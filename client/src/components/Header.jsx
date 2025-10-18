import React from "react";

const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-100 py-4 px-6 flex items-center justify-between">
      <h1 className="text-lg md:text-xl font-semibold text-gray-800">
        <span className="text-indigo-600">AI-Assisted</span> Autism Screening & Therapy Tool
      </h1>
      <div className="flex items-center gap-4">
        <button className="hidden md:block text-sm text-indigo-600 font-medium hover:underline">
          Learn More
        </button>
      </div>
    </header>
  );
};

export default Header;
