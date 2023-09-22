import { useMemo, useCallback } from "react";
import { Platform, StyleSheet, useWindowDimensions } from "react-native";

import { BlurView } from "expo-blur";
import Animated, {
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";

import { Alert } from "@showtime-xyz/universal.alert";
import { Button, GradientButton } from "@showtime-xyz/universal.button";
import { Chip } from "@showtime-xyz/universal.chip";
import { ClampText } from "@showtime-xyz/universal.clamp-text";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { InformationCircle, Lock } from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { LightBox } from "@showtime-xyz/universal.light-box";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { StarDropBadge } from "app/components/badge/star-drop-badge";
import { useJoinChannel } from "app/components/creator-channels/hooks/use-join-channel";
import { NotificationsFollowButton } from "app/components/notifications-follow-button";
import { ProfileDropdown } from "app/components/profile-dropdown";
import { UserProfile, useUserProfile } from "app/hooks/api-hooks";
import { useBlock } from "app/hooks/use-block";
import { useContentWidth } from "app/hooks/use-content-width";
import { useCurrentUserId } from "app/hooks/use-current-user-id";
import { useFollow } from "app/hooks/use-follow";
import { useRedirectToCreateDrop } from "app/hooks/use-redirect-to-create-drop";
import { useUser } from "app/hooks/use-user";
import { linkifyDescription } from "app/lib/linkify";
import {
  getFullSizeCover,
  getProfileImage,
  getProfileName,
} from "app/utilities";

import { Hidden } from "design-system/hidden";
import { breakpoints } from "design-system/theme";

import { FollowButton } from "../follow-button";
import { ProfileFollows } from "./profile-follows";
import { ProfileSocial } from "./profile-social";

const AVATAR_SIZE_SMALL = 82;
const AVATAR_SIZE_LARGE = 144;

const AVATAR_BORDER_SIZE_SMALL = 4;
const AVATAR_BORDER_SIZE_LARGE = 8;

type ProfileTopProps = {
  address: string;
  isBlocked: boolean;
  animationHeaderPosition?: Animated.SharedValue<number>;
  animationHeaderHeight?: Animated.SharedValue<number>;
  profileData: UserProfile | undefined;
  isError: boolean;
  isLoading: boolean;
  savedSongs?: number;
};
export const ProfileTop = ({
  address,
  isBlocked,
  animationHeaderPosition,
  animationHeaderHeight,
  profileData,
  isError,
  isLoading,
  savedSongs,
}: ProfileTopProps) => {
  const { mutate: mutateUserProfile } = useUserProfile({ address });
  const isDark = useIsDarkMode();
  const router = useRouter();
  const userId = useCurrentUserId();
  const name = getProfileName(profileData?.profile);
  const username = profileData?.profile.username;
  const bio = profileData?.profile.bio;
  const { width, height: screenHeight } = useWindowDimensions();
  const coverWidth = useContentWidth();
  const isMdWidth = width >= breakpoints["md"];
  const profileId = profileData?.profile.profile_id;
  const isSelf = userId === profileId;

  const { top } = useSafeAreaInsets();

  const bioWithMentions = useMemo(() => linkifyDescription(bio), [bio]);
  // for iPhone 14+
  const additionalCoverheight = top > 55 ? 20 : 0;
  // banner ratio: w:h=3:1
  const coverHeight =
    (coverWidth < 768 ? coverWidth / 4 : coverWidth / 5) +
    additionalCoverheight;
  const avatarBorder = isMdWidth
    ? AVATAR_BORDER_SIZE_LARGE
    : AVATAR_BORDER_SIZE_SMALL;
  const avatarSize = isMdWidth ? AVATAR_SIZE_LARGE : AVATAR_SIZE_SMALL;
  const avatarStyle = useAnimatedStyle(() => {
    if (!animationHeaderHeight || !animationHeaderPosition) {
      return {};
    }
    return {
      transform: [
        {
          scale: interpolate(
            Math.min(animationHeaderPosition.value, 0),
            [0, animationHeaderHeight.value],
            [1, 1.15]
          ),
        },
      ],
    };
  }, []);

  return (
    <>
      <View tw="web:bg-gray-100 overflow-hidden bg-gray-400 dark:bg-gray-800">
        <View
          style={{
            height: coverHeight,
          }}
        >
          <Image
            source={{
              uri: getProfileImage(profileData?.profile),
            }}
            alt="Cover image"
            resizeMode="cover"
            style={{ ...StyleSheet.absoluteFillObject }}
          />
          <BlurView
            tint="dark"
            intensity={35}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              overflow: "hidden",
            }}
          />
        </View>
      </View>
      <View tw="px-7">
        <View
          tw="flex-row items-center"
          style={{ marginTop: -coverHeight / 10 }}
        >
          <Animated.View
            style={[
              {
                width: avatarSize + avatarBorder * 2,
                height: avatarSize + avatarBorder * 2,
                borderRadius: 9999,
                overflow: "hidden",
                borderWidth: avatarBorder,
                borderColor: isDark ? "#000" : "#FFF",
                backgroundColor: isDark ? colors.gray[900] : colors.gray[200],
                margin: -avatarBorder,
              },
              avatarStyle,
            ]}
          >
            <Skeleton
              height={avatarSize}
              width={avatarSize}
              show={isLoading}
              radius={0}
            >
              {profileData && (
                <LightBox
                  width={avatarSize}
                  height={avatarSize}
                  imgLayout={{ width: coverWidth, height: width }}
                  borderRadius={999}
                  tapToClose
                >
                  <Image
                    source={{
                      uri: getProfileImage(profileData?.profile),
                    }}
                    width={Platform.select({
                      web: screenHeight * 0.82,
                      default: undefined,
                    })}
                    height={Platform.select({
                      web: screenHeight * 0.82,
                      default: undefined,
                    })}
                    style={Platform.select({
                      web: {},
                      default: { ...StyleSheet.absoluteFillObject },
                    })}
                    alt={profileData?.profile.name ?? ""}
                  />
                </LightBox>
              )}
            </Skeleton>
          </Animated.View>
          <View tw="ml-4 flex-row items-start justify-between">
            <View tw="flex-1">
              <Text
                tw="max-w-45 text-xl font-bold text-gray-900 dark:text-white"
                numberOfLines={2}
              >
                {name}
              </Text>
              <View tw="h-2 md:h-3" />
              <View tw="flex-row items-center">
                {Boolean(username) && (
                  <>
                    <Text tw="text-xl text-gray-900 dark:text-gray-400 md:text-lg">
                      {`@${username}`}
                    </Text>
                  </>
                )}

                {profileData?.profile.verified ? (
                  <View tw="ml-1">
                    <VerificationBadge size={16} />
                  </View>
                ) : null}
                <View tw="ml-1">
                  <StarDropBadge
                    size={16}
                    data={profileData?.profile.latest_star_drop_collected}
                  />
                </View>
                {profileData?.follows_you && !isSelf ? (
                  <Chip label="Follows You" tw="ml-2" />
                ) : null}
              </View>
            </View>
          </View>
        </View>
        <View tw="py-2.5">
          {bio ? (
            <View tw="items-baseline">
              <ClampText
                text={bioWithMentions}
                maxLines={3}
                tw="text-sm text-gray-900 dark:text-white"
              />
            </View>
          ) : null}
        </View>
        <ProfileSocial profile={profileData?.profile} savedSongs={savedSongs} />
        <View tw="rounded-4xl mb-2 mt-4 border border-gray-200 px-10 py-4">
          <View tw="flex-row items-center justify-between gap-4">
            <View tw="flex-1 items-center">
              <Text tw="text-xs text-gray-500">TOKEN</Text>
              <View tw="h-2" />
              <Text tw="text-base font-bold text-gray-900 dark:text-white">
                $21.67
              </Text>
              <Button
                tw="mt-2.5"
                style={{ backgroundColor: "#08F6CC", width: "100%" }}
              >
                <>
                  <Text tw="text-base font-bold text-gray-900">Buy</Text>
                </>
              </Button>
            </View>
            <View tw="flex-1 items-center justify-center">
              <Text tw="text-xs text-gray-500">COLLECTORS</Text>
              <View tw="h-2" />
              <Text tw="text-base font-bold text-gray-900 dark:text-white">
                128
              </Text>
              <Button
                tw="mt-2.5"
                style={{ backgroundColor: "#FD749D", width: "100%" }}
              >
                <>
                  <Text tw="text-base font-bold text-gray-900">Sell</Text>
                </>
              </Button>
            </View>
            <PressableScale
              tw="absolute -right-7 top-1 h-4 w-4"
              onPress={() => {
                // router.push("/profile/tokens");
                Alert.alert("WIP");
              }}
              hitSlop={{ top: 12, left: 12, right: 12, bottom: 12 }}
            >
              <InformationCircle
                width={16}
                height={16}
                color={colors.gray[500]}
              />
            </PressableScale>
          </View>
          <View tw="mt-2 flex-row self-center">
            <Lock width={12} height={12} color={colors.gray[500]} />
            <Text
              style={{
                fontSize: 10,
              }}
              tw="ml-1 text-gray-500"
            >
              Collect at least 1 token to unlock their channel.
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};
