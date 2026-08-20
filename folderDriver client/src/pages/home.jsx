import Footer from "./ui/footer";
import Hero from "./ui/hero";
import Header from "./ui/header";
import { useFetchUserQuery } from "../store/slices/UserSlice";

export default function Home() {
  const { data, error } = useFetchUserQuery();
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar */}
      <Header data={data} />

      {/* Hero */}
      <Hero data={data} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
