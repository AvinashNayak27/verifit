import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/settings(.*)",
  "/rewards(.*)",
  "/challenges(.*)",
  "/leaderboard(.*)",
]);

export default clerkMiddleware((auth, req) => {
  const host = req.headers.get("host");
  const protocol = host.includes("localhost") ? "http" : "https";
  const redirectUrl = `${protocol}://${host}`;
  if (!auth().userId && isProtectedRoute(req)) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: redirectUrl,
      },
    });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
