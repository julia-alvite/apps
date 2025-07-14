# Instagram MCP for deco.chat

This MCP (Model Context Protocol) app integrates Instagram Graph API with deco.chat, enabling powerful Instagram management capabilities for business and creator accounts.

## Features

### 📊 **Profile & Analytics**
- Get user profile information (followers, media count, bio, etc.)
- Retrieve account insights and performance metrics
- Access media analytics (impressions, reach, engagement)

### 📸 **Content Management**
- Create and publish Instagram posts (images, videos, reels)
- Manage media containers with proper two-step publishing
- Support for captions, user tags, product tags, and locations

### 💬 **Engagement**
- Reply to comments on posts
- Manage comment moderation
- Access conversation history

### 🔍 **Discovery**
- Search hashtags and related content
- Business discovery features
- Access to mentioned content and tags

## Prerequisites

Before using this MCP, you need:

1. **Instagram Business or Creator Account** - Personal accounts have limited API access
2. **Facebook Page** - Required for Instagram API with Facebook Login
3. **Meta App** - Created in Meta for Developers platform
4. **Access Tokens** - Either Instagram or Facebook access tokens depending on login method

## Setup Instructions

### 1. Create a Meta App

1. Go to [Meta for Developers](https://developers.facebook.com/apps/)
2. Click "Create App" and select your use case
3. Add Instagram Graph API to your app products

### 2. Configure Authentication

The Instagram MCP supports two authentication methods:

#### Option A: Instagram API with Instagram Login (Recommended)
- More streamlined for Instagram-focused applications
- Doesn't require Facebook pages
- Better for creator accounts

#### Option B: Instagram API with Facebook Login
- More features available
- Required for some advanced business features
- Requires connected Facebook page

### 3. Get Access Tokens

#### For Instagram Login:
- Use Instagram Basic Display API flow
- Get user access token with required permissions

#### For Facebook Login:
- Use Facebook Login flow
- Get page access token for connected Instagram account

### 4. Configure the MCP

When installing the Instagram MCP in deco.chat, provide:

```typescript
{
  appId: "your_instagram_app_id",
  appSecret: "your_instagram_app_secret", 
  accessToken: "your_access_token",
  apiVersion: "v23.0", // Optional, defaults to v23.0
  useInstagramLogin: true // true for Instagram login, false for Facebook login
}
```

## Required Permissions

Ensure your app has the following permissions:

### Instagram Login Mode:
- `instagram_basic`
- `instagram_content_publish`
- `instagram_manage_comments`
- `instagram_manage_insights`

### Facebook Login Mode:
- `instagram_basic`
- `instagram_content_publish`
- `instagram_manage_comments`
- `instagram_manage_insights`
- `pages_show_list`
- `pages_read_engagement`

## Available Functions

### Loaders (Data Retrieval)

#### `getUserProfile`
Get Instagram user profile information.

```typescript
// Get authenticated user's profile
const profile = await getUserProfile({});

// Get specific user's profile
const profile = await getUserProfile({
  userId: "17841400455970028",
  fields: "id,username,followers_count,media_count,biography"
});
```

#### `getUserMedia`
Retrieve user's Instagram media posts with pagination.

```typescript
const media = await getUserMedia({
  userId: "me", // Optional, defaults to authenticated user
  limit: 25,
  fields: "id,media_type,media_url,caption,timestamp,like_count"
});
```

#### `getMediaInsights`
Get analytics data for specific media posts.

```typescript
const insights = await getMediaInsights({
  mediaId: "17895695668004550",
  metric: "impressions,reach,likes,comments,saves"
});
```

### Actions (Operations)

#### `createPost`
Create a media container for Instagram post.

```typescript
// Create image post
const container = await createPost({
  image_url: "https://example.com/image.jpg",
  media_type: "IMAGE",
  caption: "Check out this amazing photo! #instagram #social",
  location_id: "213385402"
});

// Create video post
const container = await createPost({
  video_url: "https://example.com/video.mp4",
  media_type: "VIDEO",
  caption: "New video content!",
  thumb_offset: 5000 // 5 seconds
});

// Create Reel
const container = await createPost({
  video_url: "https://example.com/reel.mp4",
  media_type: "REEL",
  caption: "Trending reel content! #reels",
  audio_name: "Original Audio",
  cover_url: "https://example.com/cover.jpg"
});
```

#### `publishPost`
Publish a previously created media container.

```typescript
const publishedPost = await publishPost({
  creationId: container.id // ID from createPost response
});
```

#### `replyToComment`
Reply to comments on Instagram posts.

```typescript
const reply = await replyToComment({
  mediaId: "17895695668004550",
  message: "Thank you for your comment! 😊"
});
```

## Two-Step Publishing Process

Instagram requires a two-step process for content publishing:

1. **Create Container**: Use `createPost` to create a media container
2. **Publish**: Use `publishPost` to actually publish the content

```typescript
// Step 1: Create the post container
const container = await createPost({
  image_url: "https://example.com/photo.jpg",
  media_type: "IMAGE",
  caption: "My new post!"
});

// Step 2: Publish the post
const published = await publishPost({
  creationId: container.id
});

console.log(`Post published with ID: ${published.id}`);
```

## Media Types Support

### Images
- **Format**: JPG, PNG
- **Size**: Max 8MB
- **Dimensions**: Min 320x320, recommended 1080x1080

### Videos
- **Format**: MP4, MOV
- **Size**: Max 100MB
- **Duration**: 3-60 seconds (Reels), up to 60 minutes (regular video)
- **Dimensions**: Various ratios supported

### Reels
- **Duration**: 15-90 seconds
- **Vertical format preferred** (9:16 aspect ratio)
- **Audio support** with custom audio names

## Error Handling

The MCP includes comprehensive error handling:

```typescript
try {
  const profile = await getUserProfile({ userId: "invalid_id" });
} catch (error) {
  console.error("Instagram API Error:", error.message);
  // Handle specific error types
  if (error.code === 190) {
    // Invalid access token
  } else if (error.code === 100) {
    // Invalid parameter
  }
}
```

## Rate Limits

Instagram API has the following rate limits:

- **200 calls per hour** per user for most endpoints
- **Comment endpoints**: 60 writes per user per hour
- **Media publishing**: Different limits apply

The MCP will automatically handle rate limit responses and provide appropriate error messages.

## Best Practices

### Content Publishing
1. Always validate media URLs before creating containers
2. Use descriptive captions with relevant hashtags
3. Include location tags when relevant
4. Test with small media files first

### Analytics
1. Regular monitoring of insights for optimization
2. Track engagement metrics over time
3. Use insights to inform content strategy

### Comment Management
1. Respond promptly to user comments
2. Use professional and friendly tone
3. Monitor for inappropriate content

## Security Considerations

1. **Token Security**: Store access tokens securely using Deco's Secret type
2. **Permissions**: Only request necessary permissions
3. **Token Rotation**: Implement token refresh logic for long-lived tokens
4. **Rate Limiting**: Implement proper rate limiting in your application

## Troubleshooting

### Common Issues

#### "Invalid Access Token"
- Check if token is expired
- Verify token has required permissions
- Ensure app is in production mode if needed

#### "User Does Not Have Permission"
- Verify account type (Business/Creator required for most features)
- Check if Instagram account is connected to Facebook page (for Facebook login)
- Ensure all required permissions are granted

#### "Media Container Failed"
- Verify media URL is accessible
- Check media format and size requirements
- Ensure media type is correctly specified

### API Version Compatibility

This MCP is tested with Instagram Graph API v23.0. While it may work with other versions, we recommend using the default version for best compatibility.

## Support

For issues specific to this MCP:
1. Check the error messages for specific Instagram API errors
2. Verify your Meta app configuration
3. Ensure all prerequisites are met
4. Check Instagram API documentation for latest requirements

For Instagram API issues:
- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api)
- [Meta for Developers Community](https://developers.facebook.com/community/)

## Contributing

This MCP follows deco.chat MCP development patterns. Contributions are welcome for:
- Additional Instagram API endpoints
- Enhanced error handling
- Performance optimizations
- Documentation improvements

Remember to follow the [memory about branch naming and commits in English](id:2759211) when contributing. 