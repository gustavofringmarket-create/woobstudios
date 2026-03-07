"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { ShoppingBag, Tag, Gem } from "lucide-react";
import type { UGCAsset } from "@/lib/roblox";

export default function UGCGrid({ items }: { items: UGCAsset[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const cats = new Set(items.map((i) => i.category));
    return ["All", ...Array.from(cats).sort()];
  }, [items]);

  const filtered = activeCategory === "All"
    ? items
    : items.filter((i) => i.category === activeCategory);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg border transition-all duration-200 ${
              activeCategory === cat
                ? "bg-primary/15 border-primary/30 text-primary-light"
                : "bg-transparent border-border text-muted hover:text-foreground hover:border-border hover:bg-surface-light"
            }`}
          >
            {cat}
            {cat !== "All" && (
              <span className="ml-1.5 text-xs opacity-50">
                {items.filter((i) => i.category === cat).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((item) => (
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
                  <ShoppingBag className="w-10 h-10 text-border" />
                </div>
              )}
              {item.isLimited && (
                <div className="absolute top-2 left-2 badge bg-amber-500/90 text-white">
                  <Gem className="w-3 h-3" /> Limited
                </div>
              )}
              {!item.isForSale && !item.isLimited && (
                <div className="absolute top-2 left-2 badge bg-red-500/90 text-white">
                  Offsale
                </div>
              )}
              <div className="absolute top-2 right-2 badge bg-black/60 text-white/80 backdrop-blur-sm">
                {item.category}
              </div>
            </div>
            <div className="p-3.5">
              <p className="text-sm font-medium line-clamp-2 leading-snug">{item.name}</p>
              <div className="flex items-center justify-between mt-2">
                {item.price != null && item.price > 0 ? (
                  <span className="flex items-center gap-1 text-sm text-green-400 font-bold">
                    <Tag className="w-3 h-3" />
                    R$ {item.price}
                  </span>
                ) : (
                  <span className="text-xs text-muted">Free</span>
                )}
                <span className="text-[10px] text-muted/50 truncate ml-2">{item.creatorName}</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-24">
          <ShoppingBag className="w-12 h-12 text-border mx-auto mb-4" />
          <p className="text-muted">No items in this category</p>
        </div>
      )}
    </>
  );
}
