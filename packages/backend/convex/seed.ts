import { v } from "convex/values";

import { internal } from "./_generated/api";
import { internalAction, internalMutation } from "./_generated/server";

const MOCK_PLANTINGS = [
  {
    userName: "Maria Santos",
    species: "Japanese Cherry Blossom",
    latitude: 35.6762,
    longitude: 139.6503,
    locationName: "Ueno Park, Tokyo",
    notes: "Planted during hanami season",
    status: "verified" as const,
    daysAgo: 2,
  },
  {
    userName: "James Okafor",
    species: "Baobab",
    latitude: -1.2921,
    longitude: 36.8219,
    locationName: "Nairobi, Kenya",
    notes: "Community reforestation project",
    status: "verified" as const,
    daysAgo: 3,
  },
  {
    userName: "Lena Müller",
    species: "European Oak",
    latitude: 52.52,
    longitude: 13.405,
    locationName: "Tiergarten, Berlin",
    notes: "Part of the urban canopy initiative",
    status: "verified" as const,
    daysAgo: 1,
  },
  {
    userName: "Carlos Rivera",
    species: "Ceiba",
    latitude: 19.4326,
    longitude: -99.1332,
    locationName: "Chapultepec, Mexico City",
    notes: "Sacred tree of the Maya",
    status: "verified" as const,
    daysAgo: 5,
  },
  {
    userName: "Aisha Patel",
    species: "Neem",
    latitude: 19.076,
    longitude: 72.8777,
    locationName: "Sanjay Gandhi Park, Mumbai",
    notes: "Medicinal tree planting drive",
    status: "verified" as const,
    daysAgo: 4,
  },
  {
    userName: "Erik Lindqvist",
    species: "Silver Birch",
    latitude: 59.3293,
    longitude: 18.0686,
    locationName: "Djurgården, Stockholm",
    notes: "Nordic reforestation effort",
    status: "verified" as const,
    daysAgo: 6,
  },
  {
    userName: "Sophie Chen",
    species: "Giant Sequoia",
    latitude: 36.4864,
    longitude: -118.5658,
    locationName: "Sequoia National Park, CA",
    notes: "Seedling from fallen giant",
    status: "verified" as const,
    daysAgo: 7,
  },
  {
    userName: "Tomás Ferreira",
    species: "Cork Oak",
    latitude: 38.7223,
    longitude: -9.1393,
    locationName: "Monsanto Forest, Lisbon",
    notes: "Restoring native cork forest",
    status: "verified" as const,
    daysAgo: 10,
  },
  {
    userName: "Yuki Tanaka",
    species: "Japanese Maple",
    latitude: 35.0116,
    longitude: 135.7681,
    locationName: "Arashiyama, Kyoto",
    notes: "Autumn color restoration",
    status: "verified" as const,
    daysAgo: 12,
  },
  {
    userName: "Amara Diallo",
    species: "Mango Tree",
    latitude: 14.6928,
    longitude: -17.4467,
    locationName: "Dakar, Senegal",
    notes: "Fruit tree for the community",
    status: "verified" as const,
    daysAgo: 14,
  },
  {
    userName: "Olivia Brooks",
    species: "Coast Redwood",
    latitude: 37.7749,
    longitude: -122.4194,
    locationName: "Golden Gate Park, SF",
    notes: "Memorial planting",
    status: "verified" as const,
    daysAgo: 0,
  },
  {
    userName: "Raj Sharma",
    species: "Banyan",
    latitude: 12.9716,
    longitude: 77.5946,
    locationName: "Cubbon Park, Bangalore",
    notes: "Sacred grove expansion",
    status: "pending" as const,
    daysAgo: 0,
  },
  {
    userName: "Emma Wilson",
    species: "White Pine",
    latitude: 43.6532,
    longitude: -79.3832,
    locationName: "High Park, Toronto",
    notes: "Winter planting experiment",
    status: "pending" as const,
    daysAgo: 1,
  },
  {
    userName: "Lucas Martin",
    species: "Olive Tree",
    latitude: 43.2965,
    longitude: 5.3698,
    locationName: "Calanques, Marseille",
    notes: "Mediterranean restoration",
    status: "pending" as const,
    daysAgo: 0,
  },
  {
    userName: "Nina Volkov",
    species: "Siberian Larch",
    latitude: 55.7558,
    longitude: 37.6173,
    locationName: "Gorky Park, Moscow",
    notes: "Cold-hardy species trial",
    status: "rejected" as const,
    daysAgo: 8,
  },
];

export const insertMockPlantings = internalMutation({
  args: {
    photoStorageId: v.id("_storage"),
  },
  handler: async (ctx, { photoStorageId }) => {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    for (const p of MOCK_PLANTINGS) {
      const createdAt = now - p.daysAgo * day;
      await ctx.db.insert("plantings", {
        userId: `mock-user-${p.userName.toLowerCase().replace(/\s/g, "-")}`,
        userName: p.userName,
        species: p.species,
        latitude: p.latitude,
        longitude: p.longitude,
        locationName: p.locationName,
        photoStorageId,
        notes: p.notes,
        status: p.status,
        verificationResult:
          p.status === "verified"
            ? {
                passed: true,
                reason: `AI verified: ${p.species} clearly visible in photo. Healthy specimen planted in appropriate soil conditions.`,
                agentId: "seed-agent",
                verifiedAt: createdAt + 60000,
              }
            : p.status === "rejected"
              ? {
                  passed: false,
                  reason: "Photo does not clearly show a planted tree. Please resubmit with a clearer image.",
                  tips: "Ensure the full tree and surrounding soil are visible in the photo.",
                  agentId: "seed-agent",
                  verifiedAt: createdAt + 60000,
                }
              : undefined,
        createdAt,
      });
    }

    return { inserted: MOCK_PLANTINGS.length };
  },
});

export const seedData = internalAction({
  args: {},
  handler: async (ctx): Promise<{ inserted: number }> => {
    // 1x1 green PNG pixel
    const png = new Uint8Array([
      137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0,
      1, 0, 0, 0, 1, 8, 2, 0, 0, 0, 144, 119, 83, 222, 0, 0, 0, 12, 73, 68,
      65, 84, 8, 215, 99, 96, 100, 96, 0, 0, 0, 4, 0, 1, 39, 1, 16, 0, 0, 0,
      0, 73, 69, 78, 68, 174, 66, 96, 130,
    ]);
    const blob = new Blob([png], { type: "image/png" });
    const photoStorageId = await ctx.storage.store(blob);

    const result: { inserted: number } = await ctx.runMutation(
      internal.seed.insertMockPlantings,
      { photoStorageId },
    );

    return result;
  },
});
