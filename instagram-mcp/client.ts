// Instagram Graph API Types and Client Interface
// Based on official Instagram Graph API documentation

// User Profile Types
export interface InstagramUser {
  id: string;
  username: string;
  account_type: "BUSINESS" | "CREATOR" | "PERSONAL";
  media_count: number;
  followers_count: number;
  follows_count: number;
  name?: string;
  biography?: string;
  website?: string;
  profile_picture_url?: string;
  has_profile_pic?: boolean;
  is_published?: boolean;
  shopping_product_tag_eligibility?: boolean;
}

// Media Types
export interface InstagramMedia {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM" | "REEL";
  media_url: string;
  permalink: string;
  timestamp: string;
  caption?: string;
  username: string;
  is_comment_enabled?: boolean;
  like_count?: number;
  comments_count?: number;
  thumbnail_url?: string;
  children?: {
    data: InstagramMediaChild[];
  };
}

export interface InstagramMediaChild {
  id: string;
  media_type: "IMAGE" | "VIDEO";
  media_url: string;
  thumbnail_url?: string;
}

// Comment Types
export interface InstagramComment {
  id: string;
  text: string;
  timestamp: string;
  username: string;
  from: {
    id: string;
    username: string;
  };
  hidden: boolean;
  like_count?: number;
  replies?: {
    data: InstagramComment[];
  };
}

// Insights Types
export interface InstagramInsight {
  name: string;
  period: "day" | "week" | "days_28" | "lifetime";
  values: Array<{
    value: number;
    end_time?: string;
  }>;
  title: string;
  description: string;
  id?: string;
}

// Content Publishing Types
export interface CreateMediaContainer {
  image_url?: string;
  video_url?: string;
  media_type: "IMAGE" | "VIDEO" | "REEL";
  caption?: string;
  location_id?: string;
  user_tags?: Array<{
    username: string;
    x: number;
    y: number;
  }>;
  product_tags?: Array<{
    product_id: string;
    x: number;
    y: number;
  }>;
  audio_name?: string; // For Reels
  cover_url?: string; // For Videos/Reels
  thumb_offset?: number; // For Videos
  is_carousel_item?: boolean;
  children?: string[]; // For carousel albums
}

export interface MediaContainer {
  id: string;
  status: "FINISHED" | "IN_PROGRESS" | "ERROR";
  status_code?: string;
}

// Messages Types
export interface InstagramConversation {
  id: string;
  participants: {
    data: Array<{
      id: string;
      name: string;
      email?: string;
    }>;
  };
  messages: {
    data: InstagramMessage[];
  };
  updated_time: string;
  message_count: number;
}

export interface InstagramMessage {
  id: string;
  created_time: string;
  from: {
    id: string;
    name: string;
    email?: string;
  };
  to: {
    data: Array<{
      id: string;
      name: string;
      email?: string;
    }>;
  };
  message: string;
  attachments?: {
    data: Array<{
      id: string;
      mime_type: string;
      name: string;
      size: number;
      file_url: string;
      image_data?: {
        url: string;
        width: number;
        height: number;
      };
    }>;
  };
}

// Response wrapper types
export interface PaginatedResponse<T> {
  data: T[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
    previous?: string;
  };
}

export interface SingleResponse<T> {
  data: T;
}

// API Error Types
export interface InstagramAPIError {
  error: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id: string;
  };
}

// Client Interface following the HTTP client pattern
export interface InstagramClient {
  // User endpoints
  "GET /me": {
    searchParams: {
      fields?: string;
    };
    response: InstagramUser;
  };

  "GET /:userId": {
    searchParams: {
      fields?: string;
    };
    response: InstagramUser;
  };

  // Media endpoints
  "GET /:userId/media": {
    searchParams: {
      fields?: string;
      limit?: number;
      after?: string;
      before?: string;
    };
    response: PaginatedResponse<InstagramMedia>;
  };

  "GET /:mediaId": {
    searchParams: {
      fields?: string;
    };
    response: InstagramMedia;
  };

  "POST /:userId/media": {
    body: CreateMediaContainer;
    response: MediaContainer;
  };

  "POST /:userId/media_publish": {
    body: {
      creation_id: string;
    };
    response: {
      id: string;
    };
  };

  // Comments endpoints
  "GET /:mediaId/comments": {
    searchParams: {
      fields?: string;
      limit?: number;
      after?: string;
      before?: string;
    };
    response: PaginatedResponse<InstagramComment>;
  };

  "POST /:mediaId/comments": {
    body: {
      message: string;
    };
    response: {
      id: string;
    };
  };

  "DELETE /:commentId": {
    response: {
      success: boolean;
    };
  };

  "POST /:commentId": {
    body: {
      hide?: boolean;
    };
    response: {
      success: boolean;
    };
  };

  // Insights endpoints
  "GET /:userId/insights": {
    searchParams: {
      metric: string;
      period: "day" | "week" | "days_28" | "lifetime";
      since?: string;
      until?: string;
    };
    response: PaginatedResponse<InstagramInsight>;
  };

  "GET /:mediaId/insights": {
    searchParams: {
      metric: string;
    };
    response: PaginatedResponse<InstagramInsight>;
  };

  // Messaging endpoints
  "GET /:userId/conversations": {
    searchParams: {
      platform?: "instagram";
      folder?: "inbox";
      user_id?: string;
    };
    response: PaginatedResponse<InstagramConversation>;
  };

  "GET /:conversationId/messages": {
    searchParams: {
      fields?: string;
    };
    response: PaginatedResponse<InstagramMessage>;
  };

  "POST /:conversationId/messages": {
    body: {
      message?: {
        text: string;
      };
      messaging_type?: "RESPONSE" | "UPDATE" | "MESSAGE_TAG";
      tag?: "HUMAN_AGENT";
    };
    response: {
      message_id: string;
    };
  };

  // Hashtag search endpoints
  "GET /ig_hashtag_search": {
    searchParams: {
      user_id: string;
      q: string;
    };
    response: {
      data: Array<{
        id: string;
        name: string;
      }>;
    };
  };

  "GET /:hashtagId/top_media": {
    searchParams: {
      user_id: string;
      fields?: string;
    };
    response: PaginatedResponse<InstagramMedia>;
  };

  // Business Discovery endpoint
  "GET /:userId": {
    searchParams: {
      fields: string;
      username?: string;
    };
    response: InstagramUser;
  };

  // Mentions endpoints
  "GET /:userId/tags": {
    searchParams: {
      fields?: string;
    };
    response: PaginatedResponse<InstagramMedia>;
  };

  "GET /:userId/mentioned_comment": {
    searchParams: {
      comment_id: string;
      fields?: string;
    };
    response: InstagramComment;
  };

  "GET /:userId/mentioned_media": {
    searchParams: {
      media_id: string;
      fields?: string;
    };
    response: InstagramMedia;
  };
}
