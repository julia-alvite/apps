import { AppContext } from "../mod.ts";
import { InstagramInsight, PaginatedResponse } from "../client.ts";

export interface Props {
  /**
   * @description Instagram Media ID to get insights for
   */
  mediaId: string;

  /**
   * @description Metrics to retrieve. Common metrics: impressions, reach, likes, comments, saves, shares, profile_views, video_views
   * @default "impressions,reach,likes,comments,saves"
   */
  metric?: string;
}

/**
 * @title Get Instagram Media Insights
 * @description Retrieves analytics data for an Instagram media post including impressions, reach, engagement metrics
 */
const loader = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<PaginatedResponse<InstagramInsight>> => {
  const {
    mediaId,
    metric = "impressions,reach,likes,comments,saves",
  } = props;

  if (!mediaId) {
    throw new Error("Media ID is required to fetch insights");
  }

  try {
    const response = await ctx.state.instagram["GET /:mediaId/insights"]({
      mediaId,
    }, {
      searchParams: { metric },
    });

    return response;
  } catch (error) {
    console.error("Error fetching Instagram media insights:", error);
    throw error;
  }
};

export default loader;
