import { AppContext } from "../mod.ts";

export interface Props {
  /**
   * @description Instagram User ID to publish post for (optional, defaults to 'me' for authenticated user)
   */
  userId?: string;

  /**
   * @description Media container ID returned from createPost action
   */
  creationId: string;
}

export interface PublishResponse {
  id: string;
}

/**
 * @title Publish Instagram Post
 * @description Publishes a previously created Instagram media container. Use after creating a post with createPost action.
 */
const action = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<PublishResponse> => {
  const { userId = "me", creationId } = props;

  if (!creationId) {
    throw new Error("creationId is required to publish a post");
  }

  try {
    const response = await ctx.state.instagram["POST /:userId/media_publish"]({
      userId,
    }, {
      body: { creation_id: creationId },
    });

    return response;
  } catch (error) {
    console.error("Error publishing Instagram post:", error);
    throw error;
  }
};

export default action;
