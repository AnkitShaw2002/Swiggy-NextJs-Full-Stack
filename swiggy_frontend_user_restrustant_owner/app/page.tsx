import AppDownloadBanner from "@/component/common/AppDownloadBanner";
import BestFoodOptions from "@/component/common/BestFoodOptions";
import CitiesGrid from "@/component/common/CitiesGrid";
import DineoutRestaurants from "@/component/common/DineoutRestaurants";
import ShopGroceries from "@/component/common/ShopGroceries";
import HeaderSection from "@/component/layout/header/HeaderSection";



export default function Home() {
  return (
    <>
      <HeaderSection />
      <BestFoodOptions />
      <ShopGroceries />
      <DineoutRestaurants />
      <AppDownloadBanner />
      <CitiesGrid />
    </>
  );
}
