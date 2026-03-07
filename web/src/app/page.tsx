import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Gamepad2,
  Eye,
  ShoppingBag,
  ArrowRight,
  Layers,
} from "lucide-react";
import { getFounders, getAllGames, getAllUGC, getAllGroups } from "@/lib/data";
import { formatNumber } from "@/lib/roblox";
import VerifiedBadge from "@/components/VerifiedBadge";

export const revalidate = 300;

export default async function Home() {
  const [founders, games, ugcItems, groups] = await Promise.all([
    getFounders(),
    getAllGames(),
    getAllUGC(),
    getAllGroups(),
  ]);

  const totalVisits = games.reduce((s, g) => s + (g.visits || 0), 0);
  const totalCCU = games.reduce((s, g) => s + (g.playing || 0), 0);
  const totalMembers = groups.reduce((s, g) => s + g.memberCount, 0);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,rgba(59,89,152,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(59,89,152,0.06),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(74,111,165,0.06),transparent_40%)]" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-16 w-full">
          {/* Logo */}
          <div className="text-center animate-fade-up">
            <div className="relative flex justify-center mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[600px] h-[250px] bg-primary/12 rounded-full blur-[120px]" />
              </div>
              <Image
                src="/logo.png"
                alt="Woob Studios"
                width={900}
                height={350}
                className="relative h-32 sm:h-44 lg:h-52 w-auto"
                priority
              />
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted max-w-xl mx-auto leading-relaxed">
              Independent studio developing Roblox games and UGC content.
            </p>
          </div>

          {/* Founders */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-12 animate-fade-up anim-delay-1">
            {founders.map((f) => (
              <a
                key={f.user.id}
                href={`https://www.roblox.com/users/${f.user.id}/profile`}
                target="_blank"
                rel="noopener noreferrer"
                className="founder-card rounded-2xl px-6 py-5 flex items-center gap-5 w-full sm:w-auto sm:min-w-[300px]"
              >
                <div className="shrink-0">
                  {f.avatar ? (
                    <Image
                      src={f.avatar}
                      alt={f.user.displayName}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-border"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-primary/15 rounded-2xl flex items-center justify-center text-primary-light font-bold text-2xl">
                      {f.user.displayName[0]}
                    </div>
                  )}
                </div>
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{f.user.displayName}</span>
                    {f.user.hasVerifiedBadge && <VerifiedBadge size={18} />}
                  </div>
                  <p className="text-sm text-muted">@{f.user.name}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-primary-light/70">Discord: {f.discord}</span>
                    <span className="text-xs text-muted/40">|</span>
                    <span className="text-xs text-primary-light/70">X: @{f.x}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-4 sm:gap-5 mt-10 animate-fade-up anim-delay-2">
            {[
              { label: "Total Visits", value: formatNumber(totalVisits), color: "text-primary-light" },
              { label: "Playing Now", value: formatNumber(totalCCU), color: "text-green-400" },
              { label: "Games", value: games.length.toString(), color: "text-foreground" },
              { label: "UGC Items", value: ugcItems.length.toString(), color: "text-foreground" },
              { label: "Members", value: formatNumber(totalMembers), color: "text-foreground" },
            ].map((s) => (
              <div key={s.label} className="stat-block rounded-2xl p-6 sm:p-8 text-center">
                <p className={`text-3xl sm:text-5xl font-bold tracking-tight ${s.color}`}>{s.value}</p>
                <p className="text-xs sm:text-sm text-muted mt-2.5 uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
      </section>

      {/* Groups */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-primary-light" />
              <span className="text-xs text-primary-light uppercase tracking-widest font-medium">Groups</span>
            </div>
            <h2 className="section-title">Our Groups</h2>
          </div>
          <Link href="/groups" className="text-sm text-muted hover:text-primary-light flex items-center gap-1.5 transition-colors pb-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {groups.map((group) => (
            <a
              key={group.id}
              href={`https://www.roblox.com/groups/${group.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card rounded-xl p-5 flex flex-col items-center gap-3.5 text-center"
            >
              <div className="relative w-16 h-16 rounded-xl overflow-hidden ring-1 ring-border">
                {group.icon ? (
                  <Image src={group.icon} alt={group.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary-light text-xl font-bold">
                    {group.name[0]}
                  </div>
                )}
              </div>
              <div className="min-w-0 w-full">
                <div className="flex items-center justify-center gap-1">
                  <p className="font-semibold text-sm line-clamp-1">{group.name}</p>
                  {group.hasVerifiedBadge && <VerifiedBadge size={14} />}
                </div>
                <p className="text-xs text-muted mt-1 flex items-center justify-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {formatNumber(group.memberCount)}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <div className="divider mx-8" />

      {/* Games */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Gamepad2 className="w-4 h-4 text-primary-light" />
              <span className="text-xs text-primary-light uppercase tracking-widest font-medium">Games</span>
            </div>
            <h2 className="section-title">Popular Games</h2>
          </div>
          <Link href="/games" className="text-sm text-muted hover:text-primary-light flex items-center gap-1.5 transition-colors pb-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {games.filter(g => g.visits > 0).slice(0, 6).map((game) => (
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
                <h3 className="font-semibold text-base line-clamp-1">{game.name}</h3>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> {formatNumber(game.visits)}
                  </span>
                  <span className="text-border">|</span>
                  <span>{game.groupName}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <div className="divider mx-8" />

      {/* UGC */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag className="w-4 h-4 text-primary-light" />
              <span className="text-xs text-primary-light uppercase tracking-widest font-medium">UGC</span>
            </div>
            <h2 className="section-title">UGC Items</h2>
          </div>
          <Link href="/ugc" className="text-sm text-muted hover:text-primary-light flex items-center gap-1.5 transition-colors pb-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...ugcItems].sort(() => Math.random() - 0.5).slice(0, 10).map((item) => (
            <a
              key={`${item.itemType}-${item.id}`}
              href={item.itemType === "Bundle"
                ? `https://www.roblox.com/bundles/${item.id}`
                : `https://www.roblox.com/catalog/${item.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card rounded-xl overflow-hidden"
            >
              <div className="relative aspect-square bg-surface-light">
                {item.thumbnail ? (
                  <Image src={item.thumbnail} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-border" />
                  </div>
                )}
              </div>
              <div className="p-3.5">
                <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                {item.price != null && item.price > 0 ? (
                  <p className="text-xs text-green-400 mt-1 font-semibold">R$ {item.price}</p>
                ) : (
                  <p className="text-xs text-muted mt-1">Free</p>
                )}
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
