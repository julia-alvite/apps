import { AppContext } from "../mod.ts";
import { InstagramUser } from "../client.ts";

export interface Props {
  /**
   * @description Instagram User ID (optional, defaults to 'me' for authenticated user)
   */
  userId?: string;

  /**
   * @description Fields to retrieve for the user profile
   * @default "id,username,account_type,media_count,followers_count,follows_count,name,biography,website,profile_picture_url"
   */
  fields?: string;
}

/**
 * @title Get Instagram User Profile
 * @description Retrieves Instagram user profile information including followers, media count, and bio
 */
const loader = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<InstagramUser> => {
  const {
    userId = "me",
    fields =
      "id,username,account_type,media_count,followers_count,follows_count,name,biography,website,profile_picture_url",
  } = props;

  try {
    const response = await ctx.state.instagram["GET /:userId"]({
      userId,
    }, {
      searchParams: { fields },
    });

    return response;
  } catch (error) {
    console.error("Error fetching Instagram user profile:", error);
    throw error;
  }
};

export default loader;
