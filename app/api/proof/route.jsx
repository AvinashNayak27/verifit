import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ message: "User not found" });
  }

  // Get the OAuth access token for the user
  const provider = "oauth_google";

  try {
    const clerkResponse = await clerkClient().users.getUserOauthAccessToken(
      userId,
      provider
    );

    const accessToken = clerkResponse.data[0]?.token;
    console.log(accessToken);

    if (!accessToken) {
      return NextResponse.json(
        { message: "Access token not found" },
        { status: 401 }
      );
    }

    // Attempt to fetch fitness data with the access token
    try {
      const response = await fetch(
        "https://verifit-backend.fly.dev/fetch-fitness-data",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);

    } catch (error) {
      console.error('Error fetching fitness data:', error);
      return NextResponse.json(
        { message: "Error fetching fitness data" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error getting OAuth access token:', error);
    return NextResponse.json(
      { message: "Session token expired" },
      { status: 401 }
    );
  }
}
