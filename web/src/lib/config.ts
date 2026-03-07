export const FOUNDERS = [
  { userId: 2688437972, discord: "1mrpoorguy", x: "1mrpoorguy" },
  { userId: 1111392738, discord: "b3rcha", x: "b3rcha" },
] as const;

// Groups with games
export const GAME_GROUPS = [887221955, 924232609] as const;

// Groups with UGC items
export const UGC_GROUPS = [236794251, 560843286, 954720425] as const;

export const ALL_GROUPS = [...GAME_GROUPS, ...UGC_GROUPS] as const;
