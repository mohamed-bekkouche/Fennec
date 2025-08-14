import ClickToWear from "../components/ClickToWear";
import Hero from "../components/Home/Hero";
import SeasonCollection from "../components/Collection/SeasonCollection";
import ScrollBox from "../components/ScrollBox";
import Collections from "../components/Collection/Collections";
import Faq from "../components/Faq/Faq";
import BrandsSlider from "../components/BrandsSlider";
import CustimizeSuit from "../components/Home/CustimizeSuit";

const Home = () => {
  return (
    <>
      <Hero />
      <SeasonCollection />
      <ScrollBox />
      <Collections />
      <BrandsSlider />
      <CustimizeSuit />
      <ClickToWear />
      <Faq />
    </>
  );
};

export default Home;
