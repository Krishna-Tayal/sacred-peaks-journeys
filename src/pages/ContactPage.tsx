import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/home/ContactSection";
import heroImg from "@/assets/hero-bg.jpg";

const ContactPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="relative h-[40vh] flex items-center justify-center">
        <img src={heroImg} alt="Himalayas" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-mountain/70" />
        <div className="relative z-10 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">
            Contact <span className="text-gradient-gold">Us</span>
          </h1>
        </div>
      </section>
      <ContactSection />
      <Footer />
    </div>
  );
};

export default ContactPage;
