import basiq from "./index.js"; // Import the SDK

// Get an access token for Basiq API requests
export const getAccessToken = async () => {
  try {
    basiq.auth(`Basic ${process.env.NEXT_PUBLIC_BASIQ_API_KEY}`);

    const { data } = await basiq.postToken(
      { scope: "SERVER_ACCESS" },
      { "BASIQ-version": "3.0" }
    );

    return data.access_token;
  } catch (error) {
    console.error("❌ Error fetching Basiq access token:", error);
    throw error;
  }
};

// Create a Basiq user (linked to Clerk's user ID)
export const createBasiqUser = async (clerkUserId, email) => {
  try {
    const accessToken = await getAccessToken();
    basiq.auth(accessToken);

    const { data } = await basiq.createUser({
      email,
      mobile: "+61412345678", // Placeholder mobile (Basiq requires it)
      firstName: "Clerk",
      lastName: "User",
    });

    return data;
  } catch (error) {
    console.error("❌ Error creating Basiq user:", error);
    throw error;
  }
};

// Get user accounts from Basiq
export const getUserAccounts = async (basiqUserId) => {
  try {
    const accessToken = await getAccessToken();
    basiq.auth(accessToken);

    const { data } = await basiq.getUserAccounts({ id: basiqUserId });
    return data;
  } catch (error) {
    console.error("❌ Error fetching user accounts:", error);
    throw error;
  }
};

// Get user transactions from Basiq
export const getUserTransactions = async (basiqUserId) => {
  try {
    const accessToken = await getAccessToken();
    basiq.auth(accessToken);

    const { data } = await basiq.getUserTransactions({ id: basiqUserId });
    return data;
  } catch (error) {
    console.error("❌ Error fetching transactions:", error);
    throw error;
  }
};
