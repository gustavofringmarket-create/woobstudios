import Image from "next/image";
import { Gamepad2, Eye, Heart } from "lucide-react";
import { getAllGames } from "@/lib/data";
import { formatNumber } from "@/lib/roblox";

export const revalidate = 300;

export default async function GamesPage() {
  const games = await getAllGames();

  const totalVisits = games.reduce((s, g) => s + (g.visits || 0), 0);
  const totalCCU = games.reduce((s, g) => s + (g.playing || 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
          <div className="flex items-center gap-2.5 mb-3">
            <Gamepad2 className="w-5 h-5 text-primary-light" />
            <span className="text-xs text-primary-light uppercase tracking-widest font-medium">Games</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Our Games</h1>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm text-muted">
              <span className="text-2xl font-bold text-foreground">{games.length}</span> games
            </div>
            <span className="w-px h-5 bg-border" />
            <div className="flex items-center gap-2 text-sm text-muted">
              <span className="text-2xl font-bold text-foreground">{formatNumber(totalVisits)}</span> visits
            </div>
            <span className="w-px h-5 bg-border" />
            <div className="flex items-center gap-2 text-sm">
              <span className="text-2xl font-bold text-green-400">{formatNumber(totalCCU)}</span>
              <span className="text-muted">playing</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {games.map((game) => (
            <a
              key={game.id}
              href={`https://www.roblox.com/games/${game.rootPlaceId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card rounded-xl overflow-hidden"
            >
              <div className="relative h-48 bg-surface-light">
                {game.thumbnail ? (
                  <Image src={game.thumbnail} alt={game.name} fill className="object-cover" />
                ) : game.icon ? (
                  <Image src={game.icon} alt={game.name} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Gamepad2 className="w-12 h-12 text-border" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                {game.icon && game.thumbnail && (
                  <div className="absolute bottom-3 left-3 w-12 h-12 rounded-xl overflow-hidden ring-2 ring-black/30 shadow-lg">
                    <Image src={game.icon} alt="" fill className="object-cover" />
                  </div>
                )}
                {game.playing > 0 && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-green-500/90 text-white text-xs font-semibold rounded-lg shadow-lg">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    {formatNumber(game.playing)}
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg line-clamp-1">{game.name}</h3>
                {game.description && (
                  <p className="text-sm text-muted mt-2 line-clamp-2 leading-relaxed">{game.description}</p>
                )}
                <div className="flex items-center gap-3 mt-3 text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    {formatNumber(game.visits)}
                  </span>
                  {game.favorites > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5" />
                      {formatNumber(game.favorites)}
                    </span>
                  )}
                  <span className="text-border">|</span>
                  <span>{game.groupName}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {games.length === 0 && (
          <div className="text-center py-24">
            <Gamepad2 className="w-12 h-12 text-border mx-auto mb-4" />
            <p className="text-muted">No games yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
