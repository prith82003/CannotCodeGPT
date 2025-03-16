import { auth } from "@clerk/nextjs/server"; // Clerk authentication
import { createBasiqUser } from ".api/apis/basiq/basiq.js";

export async function POST(req) {
  try {
    const { userId, user } = auth(); // Get the logged-in user's ID from Clerk

    if (!userId) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Create or fetch Basiq user
    const basiqUser = await createBasiqUser(userId, user?.emailAddresses[0]?.emailAddress);

    return Response.json({ success: true, basiqUserId: basiqUser.id });
  } catch (error) {
    console.error("❌ Error connecting to Basiq:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

