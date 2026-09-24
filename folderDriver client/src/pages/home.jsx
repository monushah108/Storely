import Footer from "../components/home/footer";
import Header from "../components/home/header";
import Hero from "../components/home/hero";
import SEO from "../components/common/SEO";
import { useFetchUserQuery } from "../store/slices/UserSlice";

export default function Home() {
  const { data, error } = useFetchUserQuery();

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Storely",
    "url": "https://storely.app/",
    "applicationCategory": "BusinessApplication, StorageApplication",
    "operatingSystem": "All",
    "description": "Storely provides secure, simple, and clutter-free cloud storage to manage, preview, and share your files seamlessly.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <SEO
        title="Storely - Secure Cloud Storage & File Sharing"
        description="Storely gives you a simple, secure place to upload, organize, preview, and share your files and folders with ease. Access your cloud drive anywhere."
        keywords="cloud storage, file sharing, secure drive, online file manager, Storely, cloud backup, document sharing"
        canonical="/"
        ogImage="/home.png"
        jsonLd={homeSchema}
      />

      {/* Navbar */}
      <Header data={data} />

      {/* Hero */}
      <Hero data={data} />

      {/* Footer */}
      <Footer />
    </div>
  );
}

