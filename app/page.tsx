import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import BeforeAfterGallery from './components/BeforeAfterGallery';
import WhyChooseUs from './components/WhyChooseUs';
import Statistics from './components/Statistics';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import FloatingActionButton from './components/FloatingActionButton';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <HowItWorks />
      <BeforeAfterGallery />
      <WhyChooseUs />
      <Statistics />
      <Pricing />
      <Testimonials />
      <Footer />
      <FloatingActionButton />
    </main>
  );
}
