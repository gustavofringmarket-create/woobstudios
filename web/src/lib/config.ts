export const FOUNDERS = [
  { userId: 2688437972, discord: "1mrpoorguy", x: "1mrpoorguy" },
  { userId: 1111392738, discord: "b3rcha", x: "b3rcha" },
] as const;

export const CONTRIBUTORS = [
  { userId: 523346811, role: "Scripter" },
  { userId: 618986586, role: "Content Creator" },
  { userId: 1183138155, role: "Tester" },
  { userId: 3581619043, role: "Tester" },
  { userId: 3765858473, role: "Tester" },
  { userId: 2608072030, role: "Builder" },
  { userId: 1899239115, role: "Scripter" },
  { userId: 4013746667, role: "Scripter" },
  { userId: 678489274, role: "Builder" },
  { userId: 2893745916, role: "Animator" },
  { userId: 3057647029, role: "My Guy" },
  { userId: 369759934, role: "Builder" },
  { userId: 7306763620, role: "My Guy" },
  { userId: 4652794707, role: "Tester" },
  { userId: 1981965218, role: "Tester" },
] as const;

// Groups with games
export const GAME_GROUPS = [887221955, 924232609] as const;

// Groups with UGC items
export const UGC_GROUPS = [236794251, 560843286, 954720425] as const;

export const ALL_GROUPS = [...GAME_GROUPS, ...UGC_GROUPS] as const;
