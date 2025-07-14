import { type App, type AppContext as AC } from "@deco/deco";
import manifest, { Manifest } from "./manifest.gen.ts";
import { Secret } from "../website/loaders/secret.ts";
import { ClientOf, createHttpClient } from "../utils/http.ts";
import { InstagramClient } from "./client.ts";

export interface State {
  instagram: ClientOf<InstagramClient>;
}

export interface Props {
  /**
   * @description Your Instagram App ID from Meta App Dashboard
   */
  appId: string;

  /**
   * @description Your Instagram App Secret from Meta App Dashboard
   */
  appSecret: Secret | string;

  /**
   * @description Instagram User Access Token for API calls
   */
  accessToken: Secret | string;

  /**
   * @description API Version to use (default: v23.0)
   */
  apiVersion?: string;

  /**
   * @description Use Instagram API with Instagram Login (true) or Facebook Login (false)
   * @default true
   */
  useInstagramLogin?: boolean;
}

/**
 * @title Instagram MCP
 * @name Instagram MCP
 * @description Integration with Instagram Graph API for managing Instagram Business accounts, content publishing, insights, and messaging through deco.chat
 * @category Social Media
 * @logo https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1024px-Instagram_icon.png
 */
export default function InstagramApp(props: Props): App<Manifest, State> {
  const {
    appId: _appId,
    appSecret: _appSecret,
    accessToken,
    apiVersion = "v23.0",
    useInstagramLogin = true,
  } = props;

  const baseUrl = useInstagramLogin
    ? "https://graph.instagram.com"
    : "https://graph.facebook.com";

  const instagram = createHttpClient<InstagramClient>({
    base: `${baseUrl}/${apiVersion}`,
    headers: new Headers({
      "Authorization": `Bearer ${
        typeof accessToken === "string" ? accessToken : accessToken.get()
      }`,
      "Content-Type": "application/json",
    }),
  });

  return {
    state: {
      instagram,
    },
    manifest,
    dependencies: [],
  };
}

export type InstagramApp = ReturnType<typeof InstagramApp>;
export type AppContext = AC<InstagramApp>;