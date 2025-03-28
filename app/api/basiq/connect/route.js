import { getAuth } from "@clerk/nextjs/server";
import { createBasiqUser } from "@/.api/apis/basiq/basiq.js";

export async function POST(req) {
  try {
    const { userId } = getAuth(req); // ✅ Correct way to get Clerk userId in API routes

    if (!userId) {
      console.error("❌ No Clerk User ID found!");
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    console.log("✅ Clerk User ID:", userId);

    // Create a Basiq user using Clerk's user ID
    const basiqUser = await createBasiqUser(userId, `${userId}@example.com`);
    console.log("✅ Basiq User Created:", basiqUser);

    return Response.json({ success: true, basiqUserId: basiqUser.id });
  } catch (error) {
    console.error("❌ Error connecting to Basiq:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}