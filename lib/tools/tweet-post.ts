import { tool } from "ai";
import { z } from "zod";

// This tool assumes you already have a valid Twitter access token for the user
export const postTweet = tool({
  description: "Post a tweet on the user's Twitter account",
  parameters: z.object({
    tweet: z.string().describe("The content of the tweet to post"),
    accessToken: z.string().describe("The Twitter access token of the user"),
  }),

  execute: async ({ tweet, accessToken }) => {
    try {
      const res = await fetch("https://api.twitter.com/2/tweets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: tweet }),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`Twitter API error: ${res.status} ${errorBody}`);
      }

      const data = await res.json();

      return {
        success: true,
        tweetUrl: `https://twitter.com/user/status/${data.data.id}`,
        tweetContent: tweet,
      };
    } catch (error: any) {
      console.error("Tweet posting error:", error);
      return {
        success: false,
        tweetContent: tweet,
        error: error.message || "Failed to post tweet.",
      };
    }
  },
});
