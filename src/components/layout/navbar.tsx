import { NavMenu } from "./nav-menu";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/*
        The blur lives on its own layer: backdrop-filter on the header itself
        would trap the fixed full-screen mobile menu inside the bar.
      */}
      <div aria-hidden="true" className="absolute inset-0 bg-black/40 backdrop-blur-md" />
      <div className="relative">
        <NavMenu />
      </div>
    </header>
  );
}
