import { useCallback } from "react";
import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { TokenShareType } from "app/components/creator-token/creator-tokens-share";

export const useRedirectToCreatorTokensShare = () => {
  const router = useRouter();
  const redirectToCreatorTokensShare = useCallback(
    async (username: string, type: TokenShareType, disablePop = false) => {
      const nativeLink = `/creator-token/${username}/share?type=${type}`;
      const as = Platform.select({ native: nativeLink, web: router.asPath });
      const url = Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: {
            ...router.query,
            username,
            creatorTokensShareModal: true,
            type,
          },
        } as any,
      });
      if (disablePop) {
        router.push(url, as);
      } else if (Platform.OS === "web") {
        router.replace(url, as);
      } else {
        router.pop();
        router.push(url, as);
      }
    },
    [router]
  );

  return redirectToCreatorTokensShare;
};
