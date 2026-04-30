import HeroSlider        from '@/components/home/HeroSlider';
import ActualitesSection from '@/components/home/ActualitesSection';

export default function Home() {
  return (
    <main className="flex flex-col flex-1">
      <HeroSlider />
      <ActualitesSection count={3} title="Actualités" />
    </main>
  );
}
