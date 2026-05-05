import HeroSlider        from '@/components/home/HeroSlider';
import ActualitesSection from '@/components/home/ActualitesSection';
import DecouvrirSection  from '@/components/home/DecouvrirSection';

export default function Home() {
  return (
    <main className="flex flex-col flex-1">
      <HeroSlider />
      <ActualitesSection count={3} title="Actualités" />
      <DecouvrirSection />
    </main>
  );
}
