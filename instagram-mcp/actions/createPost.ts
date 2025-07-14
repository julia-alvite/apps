import { AppContext } from "../mod.ts";
import { CreateMediaContainer, MediaContainer } from "../client.ts";

export interface Props extends CreateMediaContainer {
  /**
   * @description Instagram User ID to create post for (optional, defaults to 'me' for authenticated user)
   */
  userId?: string;
}

/**
 * @title Create Instagram Post
 * @description Creates a media container for Instagram post. Use publishPost action to actually publish it.
 * Note: This creates a container that needs to be published separately using the publishPost action.
 */
const action = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<MediaContainer> => {
  const { userId = "me", ...mediaData } = props;

  // Validate required fields
  if (!mediaData.image_url && !mediaData.video_url) {
    throw new Error("Either image_url or video_url is required");
  }

  if (!mediaData.media_type) {
    throw new Error("media_type is required (IMAGE, VIDEO, or REEL)");
  }

  try {
    const response = await ctx.state.instagram["POST /:userId/media"]({
      userId,
    }, {
      body: mediaData,
    });

    return response;
  } catch (error) {
    console.error("Error creating Instagram post:", error);
    throw error;
  }
};

export default action;
