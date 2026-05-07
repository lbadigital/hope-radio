import { revalidatePath }         from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const PATHS_BY_POST_TYPE: Record<string, string[]> = {
  emission:    ['/emissions', '/'],
  grille_slot: ['/grille', '/'],
  post:        ['/'],
  podcast:     ['/'],
  agenda:      ['/'],
  animateur:   ['/emissions'],
  page:        ['/'],
};

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret');

  if (!secret || secret !== process.env.REVALIDATE_SECRET_KEY) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  let postType = 'page';
  try {
    const body = await request.json();
    if (typeof body.postType === 'string') postType = body.postType;
  } catch {
    // body vide ou malformé → on revalide / par défaut
  }

  const paths = PATHS_BY_POST_TYPE[postType] ?? ['/'];

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: true, paths });
}
