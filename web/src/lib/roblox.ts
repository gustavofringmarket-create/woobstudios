const USERS_API = "https://users.roblox.com/v1";
const GROUPS_API = "https://groups.roblox.com/v1";
const GAMES_API = "https://games.roblox.com/v2";
const GAMES_V1_API = "https://games.roblox.com/v1";
const THUMBNAILS_API = "https://thumbnails.roblox.com/v1";
const CATALOG_API = "https://catalog.roblox.com/v1";
const ECONOMY_API = "https://economy.roblox.com/v2";
const BUNDLES_API = "https://catalog.roblox.com/v1/bundles/details";

const CACHE_TTL = { next: { revalidate: 300 } }; // 5 min

// --- Types ---
export interface RobloxUser {
  id: number;
  name: string;
  displayName: string;
  description: string;
  created: string;
  hasVerifiedBadge: boolean;
}

export interface RobloxGroup {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  owner: { userId: number; username: string; displayName: string };
  hasVerifiedBadge: boolean;
}

export interface RobloxGame {
  id: number;
  name: string;
  description: string | null;
  placeVisits: number;
  rootPlace: { id: number };
  created: string;
  updated: string;
}

export interface GameDetail {
  id: number;
  rootPlaceId: number;
  name: string;
  description: string;
  playing: number;
  visits: number;
  maxPlayers: number;
  created: string;
  updated: string;
  favoritedCount: number;
  genre: string;
}

export interface UGCAsset {
  id: number;
  name: string;
  description: string;
  price: number | null;
  isForSale: boolean;
  isLimited: boolean;
  thumbnail: string;
  creatorName: string;
  creatorGroupId: number;
  itemType: "Asset" | "Bundle";
  category: string;
}

const ASSET_TYPE_CATEGORIES: Record<number, string> = {
  8: "Hat",
  11: "Shirt",
  12: "Pants",
  17: "Head",
  18: "Face",
  19: "Gear",
  25: "Audio",
  27: "Torso",
  28: "Right Arm",
  29: "Left Arm",
  30: "Right Leg",
  31: "Left Leg",
  41: "Hair",
  42: "Accessory",
  43: "Accessory",
  44: "Accessory",
  45: "Accessory",
  46: "Accessory",
  47: "Accessory",
  48: "Climb Animation",
  49: "Death Animation",
  50: "Fall Animation",
  51: "Idle Animation",
  52: "Run Animation",
  53: "Walk Animation",
  54: "Pose Animation",
  55: "Jump Animation",
  56: "Swim Animation",
  57: "Glide Animation",
  61: "Emote",
  62: "Video",
  64: "Back Accessory",
  65: "Front Accessory",
  66: "Waist Accessory",
  67: "Shoulder Accessory",
  68: "Head Accessory",
  69: "Face Accessory",
  70: "Neck Accessory",
  71: "Shoulder Accessory",
  72: "Front Accessory",
  73: "Back Accessory",
  74: "Waist Accessory",
  76: "Wings",
  78: "Dynamic Head",
  79: "Dynamic Head",
};

export interface RobloxThumbnail {
  targetId: number;
  state: string;
  imageUrl: string;
}

// --- API Functions ---

export async function getUser(userId: number): Promise<RobloxUser | null> {
  try {
    const res = await fetch(`${USERS_API}/users/${userId}`, CACHE_TTL);
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function getGroup(groupId: number): Promise<RobloxGroup | null> {
  try {
    const res = await fetch(`${GROUPS_API}/groups/${groupId}`, CACHE_TTL);
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function getGroupGames(groupId: number): Promise<RobloxGame[]> {
  try {
    const res = await fetch(
      `${GAMES_API}/groups/${groupId}/games?sortOrder=Desc&limit=50`,
      CACHE_TTL
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

export async function getUniverseDetails(universeIds: number[]): Promise<GameDetail[]> {
  if (universeIds.length === 0) return [];
  try {
    const ids = universeIds.join(",");
    const res = await fetch(`${GAMES_V1_API}/games?universeIds=${ids}`, CACHE_TTL);
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

export async function getAvatarHeadshots(userIds: number[]): Promise<RobloxThumbnail[]> {
  try {
    const ids = userIds.join(",");
    const res = await fetch(
      `${THUMBNAILS_API}/users/avatar-headshot?userIds=${ids}&size=420x420&format=Png&isCircular=false`,
      CACHE_TTL
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

export async function getAvatarFullBody(userIds: number[]): Promise<RobloxThumbnail[]> {
  try {
    const ids = userIds.join(",");
    const res = await fetch(
      `${THUMBNAILS_API}/users/avatar?userIds=${ids}&size=420x420&format=Png&isCircular=false`,
      CACHE_TTL
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

export async function getGameIcons(universeIds: number[]): Promise<RobloxThumbnail[]> {
  if (universeIds.length === 0) return [];
  try {
    const ids = universeIds.join(",");
    const res = await fetch(
      `${THUMBNAILS_API}/games/icons?universeIds=${ids}&size=512x512&format=Png&isCircular=false`,
      CACHE_TTL
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

export async function getGameThumbnails(universeIds: number[]): Promise<RobloxThumbnail[]> {
  if (universeIds.length === 0) return [];
  try {
    const ids = universeIds.join(",");
    const res = await fetch(
      `${THUMBNAILS_API}/games/multiget/thumbnails?universeIds=${ids}&size=768x432&format=Png&countPerUniverse=1`,
      CACHE_TTL
    );
    if (!res.ok) return [];
    const data = await res.json();
    const results: RobloxThumbnail[] = [];
    for (const entry of data.data || []) {
      if (entry.thumbnails?.length > 0) {
        results.push({
          targetId: entry.universeId,
          state: entry.thumbnails[0].state,
          imageUrl: entry.thumbnails[0].imageUrl,
        });
      }
    }
    return results;
  } catch { return []; }
}

export async function getGroupUGCItems(groupId: number): Promise<UGCAsset[]> {
  const items: UGCAsset[] = [];
  const seen = new Set<string>();

  // Search with multiple sort types across key categories to ensure complete coverage
  const searches = [
    { category: "All", sortType: "Relevance" },
    { category: "All", sortType: "3" },          // Recently created
    { category: "All", sortType: "1" },          // Price low to high
    { category: "Collectibles", sortType: "Relevance" },
    { category: "Accessories", sortType: "Relevance" },
    { category: "BodyParts", sortType: "Relevance" },
    { category: "Clothing", sortType: "Relevance" },
    { category: "AvatarAnimations", sortType: "Relevance" },
  ];

  for (const search of searches) {
    let cursor: string | null = "";
    while (cursor !== null) {
      try {
        const cursorParam: string = cursor ? `&cursor=${cursor}` : "";
        const reqUrl: string = `${CATALOG_API}/search/items/details?category=${search.category}&creatorTargetId=${groupId}&creatorType=Group&limit=30&sortType=${search.sortType}${cursorParam}`;
        const res = await fetch(reqUrl, CACHE_TTL);
        if (!res.ok) break;
        const data = await res.json();
        if (!data.data || data.data.length === 0) break;
        for (const d of data.data) {
          const key = `${d.itemType}-${d.id}`;
          if (!seen.has(key)) {
            seen.add(key);
            items.push({
              id: d.id,
              name: d.name || "",
              description: d.description || "",
              price: d.price ?? d.lowestPrice ?? null,
              isForSale: d.priceStatus === "Free" || d.price != null || d.lowestPrice != null,
              isLimited: d.collectibleItemId != null || d.unitsAvailableForConsumption != null,
              thumbnail: "",
              creatorName: d.creatorName || "",
              creatorGroupId: d.creatorTargetId || 0,
              itemType: d.itemType === "Bundle" ? "Bundle" : "Asset",
              category: d.itemType === "Bundle" ? "Bundle" : (ASSET_TYPE_CATEGORIES[d.assetType as number] || "Other"),
            });
          }
        }
        cursor = data.nextPageCursor || null;
      } catch { break; }
    }
  }
  return items;
}

export async function getAssetDetails(assetId: number, retries = 2): Promise<UGCAsset | null> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${ECONOMY_API}/assets/${assetId}/details`, CACHE_TTL);
      if (res.status === 429 && attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      if (!res.ok) return null;
      const d = await res.json();
      return {
        id: d.AssetId,
        name: d.Name,
        description: d.Description || "",
        price: d.PriceInRobux,
        isForSale: d.IsForSale,
        isLimited: d.IsLimited || d.IsLimitedUnique || d.CollectibleItemId != null,
        thumbnail: "",
        creatorName: d.Creator?.Name || "",
        creatorGroupId: d.Creator?.CreatorTargetId || 0,
        itemType: "Asset",
        category: ASSET_TYPE_CATEGORIES[d.AssetTypeId as number] || "Other",
      };
    } catch {
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
        continue;
      }
      return null;
    }
  }
  return null;
}

// Bulk fetch item details via catalog API (more reliable than economy API)
export async function getCatalogItemDetails(
  items: { id: number; itemType: string }[]
): Promise<UGCAsset[]> {
  if (items.length === 0) return [];
  const results: UGCAsset[] = [];

  // Batch in groups of 30 (API limit)
  for (let i = 0; i < items.length; i += 30) {
    const batch = items.slice(i, i + 30);
    try {
      const body = {
        items: batch.map((item) => ({
          itemType: item.itemType,
          id: item.id,
        })),
      };
      const res = await fetch("https://catalog.roblox.com/v1/catalog/items/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        next: { revalidate: 300 },
      });
      if (!res.ok) continue;
      const data = await res.json();
      for (const d of data.data || []) {
        results.push({
          id: d.id,
          name: d.name || "",
          description: d.description || "",
          price: d.price ?? d.lowestPrice ?? null,
          isForSale: d.priceStatus === "Free" || d.price != null || d.lowestPrice != null,
          isLimited: d.collectibleItemId != null || d.isLimited === true || d.isLimitedUnique === true,
          thumbnail: "",
          creatorName: d.creatorName || "",
          creatorGroupId: d.creatorTargetId || 0,
          itemType: d.itemType === "Bundle" ? "Bundle" : "Asset",
          category: d.itemType === "Bundle" ? "Bundle" : (ASSET_TYPE_CATEGORIES[d.assetType as number] || "Other"),
        });
      }
    } catch { continue; }

    // Small delay between batches
    if (i + 30 < items.length) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  return results;
}

export async function getBundleDetails(bundleIds: number[]): Promise<UGCAsset[]> {
  if (bundleIds.length === 0) return [];
  try {
    const ids = bundleIds.join(",");
    const res = await fetch(`${BUNDLES_API}?bundleIds=${ids}`, CACHE_TTL);
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((b: Record<string, unknown>) => ({
      id: b.id as number,
      name: b.name as string,
      description: (b.description as string) || "",
      price: (b.product as Record<string, unknown>)?.priceInRobux as number || null,
      isForSale: (b.product as Record<string, unknown>)?.isForSale as boolean || false,
      isLimited: false,
      thumbnail: "",
      creatorName: (b.creator as Record<string, unknown>)?.name as string || "",
      creatorGroupId: (b.creator as Record<string, unknown>)?.id as number || 0,
      itemType: "Bundle" as const,
      category: "Bundle",
    }));
  } catch { return []; }
}

export async function getAssetThumbnails(assetIds: number[]): Promise<RobloxThumbnail[]> {
  if (assetIds.length === 0) return [];
  const results: RobloxThumbnail[] = [];
  // Batch in groups of 50 to avoid API limits
  for (let i = 0; i < assetIds.length; i += 50) {
    const batch = assetIds.slice(i, i + 50);
    try {
      const ids = batch.join(",");
      const res = await fetch(
        `${THUMBNAILS_API}/assets?assetIds=${ids}&size=420x420&format=Png`,
        CACHE_TTL
      );
      if (!res.ok) continue;
      const data = await res.json();
      results.push(...(data.data || []));
    } catch { continue; }
  }
  return results;
}

export async function getBundleThumbnails(bundleIds: number[]): Promise<RobloxThumbnail[]> {
  if (bundleIds.length === 0) return [];
  try {
    const ids = bundleIds.join(",");
    const res = await fetch(
      `${THUMBNAILS_API}/bundles/thumbnails?bundleIds=${ids}&size=420x420&format=Png`,
      CACHE_TTL
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

export async function getGroupIcons(groupIds: number[]): Promise<RobloxThumbnail[]> {
  if (groupIds.length === 0) return [];
  try {
    const ids = groupIds.join(",");
    const res = await fetch(
      `${THUMBNAILS_API}/groups/icons?groupIds=${ids}&size=420x420&format=Png&isCircular=false`,
      CACHE_TTL
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

// --- Helpers ---
export function formatNumber(num: number | undefined | null): string {
  if (num == null || isNaN(num)) return "0";
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}
