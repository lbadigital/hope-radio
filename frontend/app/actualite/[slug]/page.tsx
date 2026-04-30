interface ActualitePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ActualitePage({ params }: ActualitePageProps) {
  const { slug } = await params;

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      HOPE RADIO — ACTUALITÉ : {slug}
    </div>
  );
}
