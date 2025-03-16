import basiq from "./index.js"; // Import the SDK

// Get an access token for Basiq API requests
export const getAccessToken = async () => {
  try {
    console.log("🔵 Fetching Basiq access token...");

    const response = await fetch("https://au-api.basiq.io/token", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/x-www-form-urlencoded",
        Authorization: process.env.NEXT_PUBLIC_BASIQ_API_KEY, // API Key from .env
        "basiq-version": "3.0",
      },
      body: new URLSearchParams({
        scope: "SERVER_ACCESS",
      }),
    });

    if (!response.ok) {
      throw new Error(`❌ Error ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    console.log("✅ Access Token:", data.access_token);

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

export const getUserTransactions = async (basiqUserId) => {
  try {
    const accessToken = await getAccessToken();
    basiq.auth(accessToken);

    const url = `https://au-api.basiq.io/users/${basiqUserId}/transactions?limit=500`;
    console.log("🔵 Fetching transactions from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "basiq-version": "3.0",
      },
    });

    console.log("🔵 Raw Response:", response);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`❌ Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Transactions Data:", data);
    return data;
  } catch (error) {
    console.error("❌ Error fetching transactions:", error);
    throw error;
  }
};