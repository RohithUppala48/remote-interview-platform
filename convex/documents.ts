import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {},
  handler: async (ctx) => {
    const documentId = await ctx.db.insert("documents", {
      content: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return documentId;
  },
});

export const get = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, content } = args;
    await ctx.db.patch(id, {
      content,
      updatedAt: Date.now(),
    });
  },
}); 