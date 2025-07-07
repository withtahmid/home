import { router } from "../trpc/index.mjs";
import publicProcedure from "../trpc/middlewares/public.mjs";
// import publicProcedure from "../trpc/procedures/public.mjs";

export const appRouter = router({
    hello: publicProcedure.query(async () => "Hello From App Router"),
});
export type AppRouter = typeof appRouter;
