import Navbarblock from "@/components/Navbar";

export default function ProtectedRoutesLayou({ children }) {
  return <div>
      <Navbarblock/>
      {children}
    </div>;
}
