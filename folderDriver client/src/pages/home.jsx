import Footer from "./ui/footer";
import Hero from "./ui/hero";
import Header from "./ui/header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar */}
      <Header />

      {/* Hero */}
      <Hero />

      {/* Footer */}
      <Footer />
    </div>
  );
}
