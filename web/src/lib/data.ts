import {
  getUser,
  getGroup,
  getGroupGames,
  getUniverseDetails,
  getAvatarHeadshots,
  getGameIcons,
  getGameThumbnails,
  getGroupIcons,
  getGroupUGCItems,
  getAssetThumbnails,
  getBundleThumbnails,
  type RobloxUser,
  type RobloxGroup,
  type GameDetail,
  type UGCAsset,
  type RobloxThumbnail,
} from "./roblox";
import { FOUNDERS, CONTRIBUTORS, GAME_GROUPS, UGC_GROUPS, ALL_GROUPS } from "./config";

export interface Founder {
  user: RobloxUser;
  avatar: string;
  discord: string;
  x: string;
}

export interface StudioGame {
  id: number;
  rootPlaceId: number;
  name: string;
  description: string;
  playing: number;
  visits: number;
  favorites: number;
  icon: string;
  thumbnail: string;
  groupName: string;
  groupId: number;
}

export interface StudioGroup {
  id: number;
  name: string;
  icon: string;
  memberCount: number;
  hasVerifiedBadge: boolean;
}

export interface StudioStats {
  totalVisits: number;
  totalCCU: number;
  totalGames: number;
  totalUGC: number;
  totalMembers: number;
}

export async function getFounders(): Promise<Founder[]> {
  const userIds = FOUNDERS.map((f) => f.userId);
  const [headshots, ...users] = await Promise.all([
    getAvatarHeadshots(userIds),
    ...FOUNDERS.map((f) => getUser(f.userId)),
  ]);

  return FOUNDERS.map((f, i) => ({
    user: users[i] || { id: f.userId, name: "Unknown", displayName: "Unknown", description: "", created: "", hasVerifiedBadge: false },
    avatar: headshots.find((h) => h.targetId === f.userId)?.imageUrl || "",
    discord: f.discord,
    x: f.x,
  }));
}

export interface Contributor {
  user: RobloxUser;
  avatar: string;
  role: string;
}

export async function getContributors(): Promise<Contributor[]> {
  const userIds = CONTRIBUTORS.map((c) => c.userId);
  const [headshots, ...users] = await Promise.all([
    getAvatarHeadshots(userIds),
    ...CONTRIBUTORS.map((c) => getUser(c.userId)),
  ]);

  return CONTRIBUTORS.map((c, i) => ({
    user: users[i] || { id: c.userId, name: "Unknown", displayName: "Unknown", description: "", created: "", hasVerifiedBadge: false },
    avatar: headshots.find((h) => h.targetId === c.userId)?.imageUrl || "",
    role: c.role,
  }));
}

export async function getGroups(): Promise<(RobloxGroup | null)[]> {
  return Promise.all(ALL_GROUPS.map((id) => getGroup(id)));
}

export async function getAllGroups(): Promise<StudioGroup[]> {
  const groupIds = [...ALL_GROUPS];
  const [icons, ...groups] = await Promise.all([
    getGroupIcons(groupIds),
    ...groupIds.map((id) => getGroup(id)),
  ]);

  return groups
    .filter((g): g is RobloxGroup => g !== null)
    .map((g) => ({
      id: g.id,
      name: g.name,
      icon: icons.find((i) => i.targetId === g.id && i.state === "Completed")?.imageUrl || "",
      memberCount: g.memberCount,
      hasVerifiedBadge: g.hasVerifiedBadge,
    }));
}

export async function getAllGames(): Promise<StudioGame[]> {
  const groupResults = await Promise.all(
    GAME_GROUPS.map(async (groupId) => {
      const [group, rawGames] = await Promise.all([
        getGroup(groupId),
        getGroupGames(groupId),
      ]);
      return { group, rawGames, groupId };
    })
  );

  const allRawGames = groupResults.flatMap((r) => r.rawGames);
  if (allRawGames.length === 0) return [];

  const universeIds = allRawGames.map((g) => g.id);

  const [details, icons, thumbnails] = await Promise.all([
    getUniverseDetails(universeIds),
    getGameIcons(universeIds),
    getGameThumbnails(universeIds),
  ]);

  const detailMap = new Map<number, GameDetail>();
  for (const d of details) detailMap.set(d.id, d);

  const iconMap = new Map<number, string>();
  for (const i of icons) if (i.state === "Completed") iconMap.set(i.targetId, i.imageUrl);

  const thumbMap = new Map<number, string>();
  for (const t of thumbnails) if (t.state === "Completed") thumbMap.set(t.targetId, t.imageUrl);

  const games: StudioGame[] = [];
  for (const gr of groupResults) {
    for (const raw of gr.rawGames) {
      const detail = detailMap.get(raw.id);
      games.push({
        id: raw.id,
        rootPlaceId: detail?.rootPlaceId || raw.rootPlace?.id || 0,
        name: detail?.name || raw.name,
        description: detail?.description || raw.description || "",
        playing: detail?.playing || 0,
        visits: detail?.visits || raw.placeVisits || 0,
        favorites: detail?.favoritedCount || 0,
        icon: iconMap.get(raw.id) || "",
        thumbnail: thumbMap.get(raw.id) || "",
        groupName: gr.group?.name || "Unknown",
        groupId: gr.groupId,
      });
    }
  }

  // Filter out games with less than 10K visits, sort by visits desc
  const filtered = games.filter((g) => g.visits >= 10_000);
  filtered.sort((a, b) => b.visits - a.visits);
  return filtered;
}

export async function getAllUGC(): Promise<UGCAsset[]> {
  const allItems: UGCAsset[] = [];

  // Process groups sequentially to avoid rate limiting
  // getGroupUGCItems now returns full UGCAsset objects via catalog search/details
  for (const groupId of UGC_GROUPS) {
    const items = await getGroupUGCItems(groupId);
    if (items.length === 0) continue;

    // Separate assets and bundles for thumbnail fetching
    const assets = items.filter((i) => i.itemType === "Asset");
    const bundles = items.filter((i) => i.itemType === "Bundle");

    // Fetch asset thumbnails (batched in groups of 50)
    if (assets.length > 0) {
      const assetThumbs = await getAssetThumbnails(assets.map((a) => a.id));
      for (const asset of assets) {
        const thumb = assetThumbs.find((t) => t.targetId === asset.id);
        if (thumb?.state === "Completed") asset.thumbnail = thumb.imageUrl;
      }
    }

    // Fetch bundle thumbnails
    if (bundles.length > 0) {
      const bundleThumbs = await getBundleThumbnails(bundles.map((b) => b.id));
      for (const bundle of bundles) {
        const thumb = bundleThumbs.find((t) => t.targetId === bundle.id);
        if (thumb?.state === "Completed") bundle.thumbnail = thumb.imageUrl;
      }
    }

    allItems.push(...items);
  }

  return allItems;
}

export async function getStudioStats(): Promise<StudioStats> {
  const [games, ugcItems, groups] = await Promise.all([
    getAllGames(),
    getAllUGC(),
    getGroups(),
  ]);

  const totalVisits = games.reduce((s, g) => s + (g.visits || 0), 0);
  const totalCCU = games.reduce((s, g) => s + (g.playing || 0), 0);
  const totalMembers = groups.reduce((s, g) => s + (g?.memberCount || 0), 0);

  return {
    totalVisits,
    totalCCU,
    totalGames: games.length,
    totalUGC: ugcItems.length,
    totalMembers,
  };
}
