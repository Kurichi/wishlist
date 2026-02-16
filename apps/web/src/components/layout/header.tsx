import { Heart } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="container mx-auto flex h-14 items-center gap-2 px-4">
        <Heart className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-semibold">Wishlist</h1>
      </div>
    </header>
  );
}
