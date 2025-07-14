import { AppContext } from "../mod.ts";
import { InstagramMedia, PaginatedResponse } from "../client.ts";

export interface Props {
  /**
   * @description Instagram User ID (optional, defaults to 'me' for authenticated user)
   */
  userId?: string;

  /**
   * @description Fields to retrieve for each media item
   * @default "id,media_type,media_url,permalink,timestamp,caption,username,like_count,comments_count"
   */
  fields?: string;

  /**
   * @description Maximum number of media items to retrieve
   * @default 25
   */
  limit?: number;

  /**
   * @description Pagination cursor for retrieving next page
   */
  after?: string;

  /**
   * @description Pagination cursor for retrieving previous page
   */
  before?: string;
}

/**
 * @title Get Instagram User Media
 * @description Retrieves Instagram media posts from a user's account with pagination support
 */
const loader = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<PaginatedResponse<InstagramMedia>> => {
  const {
    userId = "me",
    fields =
      "id,media_type,media_url,permalink,timestamp,caption,username,like_count,comments_count",
    limit = 25,
    after,
    before,
  } = props;

  try {
    const response = await ctx.state.instagram["GET /:userId/media"]({
      userId,
    }, {
      searchParams: {
        fields,
        limit,
        ...(after && { after }),
        ...(before && { before }),
      },
    });

    return response;
  } catch (error) {
    console.error("Error fetching Instagram user media:", error);
    throw error;
  }
};

export default loader;
