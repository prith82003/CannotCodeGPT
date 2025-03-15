import basiq from "./index.js"; // Import the SDK

export const getAccessToken = async () => {
  try {
    // Authenticate with your API key from .env.local
    basiq.auth(`Basic ${process.env.NEXT_PUBLIC_BASIQ_API_KEY}`);

    // Get the access token
    const { data } = await basiq.postToken(
      { scope: "SERVER_ACCESS" },
      { "BASIQ-version": "3.0" }
    );

    return data.access_token;
  } catch (error) {
    console.error("Error fetching Basiq access token:", error);
    throw error;
  }
};

export const createUser = async (email, mobile, firstName, lastName) => {
  try {
    // Get an access token
    const accessToken = await getAccessToken();
    basiq.auth(accessToken);

    // Create user
    const { data } = await basiq.createUser({
      email,
      mobile,
      firstName,
      lastName,
    });

    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getUserAccounts = async (userId) => {
  try {
    // Get an access token
    const accessToken = await getAccessToken();
    basiq.auth(accessToken);

    // Fetch user accounts
    const { data } = await basiq.getUserAccounts({ id: userId });
    return data;
  } catch (error) {
    console.error("Error fetching user accounts:", error);
    throw error;
  }
};

export const getUserTransactions = async (userId) => {
  try {
    // Get an access token
    const accessToken = await getAccessToken();
    basiq.auth(accessToken);

    // Fetch user transactions
    const { data } = await basiq.getUserTransactions({ id: userId });
    return data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};