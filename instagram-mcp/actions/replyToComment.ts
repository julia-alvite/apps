import { AppContext } from "../mod.ts";

export interface Props {
  /**
   * @description Instagram Media ID to reply to comment on
   */
  mediaId: string;

  /**
   * @description The reply message text
   */
  message: string;
}

export interface CommentResponse {
  id: string;
}

/**
 * @title Reply to Instagram Comment
 * @description Posts a reply to an Instagram media post comment
 */
const action = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<CommentResponse> => {
  const { mediaId, message } = props;

  if (!mediaId) {
    throw new Error("mediaId is required to reply to a comment");
  }

  if (!message || message.trim().length === 0) {
    throw new Error("message is required and cannot be empty");
  }

  try {
    const response = await ctx.state.instagram["POST /:mediaId/comments"]({
      mediaId,
    }, {
      body: { message: message.trim() },
    });

    return response;
  } catch (error) {
    console.error("Error replying to Instagram comment:", error);
    throw error;
  }
};

export default action;
