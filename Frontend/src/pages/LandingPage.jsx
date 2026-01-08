import Navbar from "../components/Navbar";
import LandingPageHeader from "../components/Landing/LandingPageHeader";
import LandingPageContent from "../components/Landing/LandingPageContent";

function LandingPage() {
  return (
    <>
      <Navbar mode="landing" />
      <LandingPageHeader />
      <LandingPageContent />
    </>
  );
}

export default LandingPage;
