import { Outlet } from "react-router-dom";

export default function LayoutPublico() {
  return (
    <main className="min-h-screen overflow-x-hidden px-4 py-6 sm:px-6 md:px-8">
      <Outlet />
    </main>
  );
}

