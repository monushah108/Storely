import Footer from "../components/home/footer";
import Header from "../components/home/header";
import Hero from "../components/home/hero";

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
