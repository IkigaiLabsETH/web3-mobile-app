import { useState, useEffect } from "react";

import { createParam } from "solito";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { Button } from "@showtime-xyz/universal.button";
import { InformationCircle, LockBadge } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { useUserProfile } from "app/hooks/api-hooks";
import { useContractBalanceOfToken } from "app/hooks/creator-token/use-balance-of-token";
import { useCreatorTokenBuy } from "app/hooks/creator-token/use-creator-token-buy";
import { useCreatorTokenPriceToBuyNext } from "app/hooks/creator-token/use-creator-token-price-to-buy-next";
import { useCreatorTokenPriceToSellNext } from "app/hooks/creator-token/use-creator-token-price-to-sell-next";
import { useCreatorTokenSell } from "app/hooks/creator-token/use-creator-token-sell";
import { useRedirectToCreatorTokensShare } from "app/hooks/use-redirect-to-creator-tokens-share-screen";
import { useWallet } from "app/hooks/use-wallet";

type Query = {
  username: string;
  selectedAction: "buy" | "sell";
};

const { useParam } = createParam<Query>();

export const BuyCreatorToken = () => {
  const wallet = useWallet();
  const [username] = useParam("username");
  const [selectedActionParam] = useParam("selectedAction");
  const [tokenAmount, setTokenAmount] = useState(1);
  const { data: profileData } = useUserProfile({ address: username });
  const buyToken = useCreatorTokenBuy({ username, tokenAmount });
  const sellToken = useCreatorTokenSell();
  const redirectToCreatorTokensShare = useRedirectToCreatorTokensShare();
  const [selectedAction, setSelectedAction] = useState<"buy" | "sell">(
    selectedActionParam ?? "buy"
  );
  const priceToBuyNext = useCreatorTokenPriceToBuyNext(
    selectedAction === "buy"
      ? {
          address: profileData?.data?.profile.creator_token?.address,
          tokenAmount,
        }
      : undefined
  );
  const priceToSellNext = useCreatorTokenPriceToSellNext(
    selectedAction === "sell"
      ? {
          address: profileData?.data?.profile.creator_token?.address,
          tokenAmount,
        }
      : undefined
  );
  const router = useRouter();

  const tokenBalance = useContractBalanceOfToken({
    ownerAddress: wallet.address,
    contractAddress: profileData?.data?.profile.creator_token?.address,
  });

  const renderBuyButton = () => {
    if (wallet.isMagicWallet) {
      return <Button onPress={() => buyToken.trigger()}>Connect</Button>;
    } else if (selectedAction === "sell") {
      return (
        <Button
          disabled={sellToken.isMutating}
          onPress={async () => {
            if (profileData?.data?.profile.creator_token) {
              const res = await sellToken.trigger({
                contractAddress:
                  profileData?.data?.profile.creator_token?.address,
                creatorTokenId: profileData?.data?.profile.creator_token?.id,
                quantity: tokenAmount,
              });
              if (res) {
                router.pop();
              }
            }
          }}
        >
          {sellToken.isMutating ? "Please wait..." : "Sell"}
        </Button>
      );
    } else {
      return (
        <Button
          disabled={buyToken.isMutating}
          onPress={async () => {
            if (profileData?.data?.profile) {
              const res = await buyToken.trigger();
              if (res) {
                redirectToCreatorTokensShare({
                  username: profileData.data.profile.username,
                  type: "collected",
                  collectedCount: tokenAmount,
                });
                router.pop();
              }
            }
          }}
        >
          {buyToken.isMutating ? "Please wait..." : "Approve & Buy"}
        </Button>
      );
    }
  };

  useEffect(() => {
    if (selectedAction === "sell" && typeof tokenBalance.data !== "undefined") {
      setTokenAmount(Math.min(1, Number(tokenBalance.data)));
    } else {
      setTokenAmount(1);
    }
  }, [selectedAction, tokenBalance.data]);

  return (
    <View tw="p-4">
      <View tw="flex-row items-center" style={{ columnGap: 8 }}>
        <View tw="flex-row items-center" style={{ columnGap: 2 }}>
          <Text tw="text-2xl font-semibold">Buy @{username}</Text>
          <VerificationBadge size={20} />
        </View>
        <Text tw="text-2xl font-semibold">tokens</Text>
      </View>
      <View tw="flex-row items-center pt-4" style={{ columnGap: 2 }}>
        <LockBadge width={14} height={14} color={colors.gray[600]} />
        <Text tw="text-gray-600">Unlocks exclusive channel content</Text>
      </View>
      <View tw="mt-4 rounded-3xl border-[1px] border-gray-300 p-8">
        <View tw="flex-row" style={{ columnGap: 16 }}>
          <Avatar size={100} url={profileData?.data?.profile.img_url} />
          <View style={{ rowGap: 16 }}>
            <View tw="flex-row" style={{ columnGap: 8 }}>
              <View tw="items-start self-start rounded-md bg-black p-2">
                <Text tw="text-xs text-white">USDC</Text>
              </View>
              {/* <View tw="items-start self-start rounded-sm bg-blue-200 px-2">
                <Text>ETH</Text>
              </View> */}
            </View>
            {selectedAction === "buy" ? (
              <View>
                {priceToBuyNext.isLoading ? (
                  <Skeleton width={100} height={32} />
                ) : (
                  <Text tw="text-4xl font-semibold">
                    ${priceToBuyNext.data?.displayPrice}
                  </Text>
                )}
              </View>
            ) : (
              <View>
                {priceToSellNext.isLoading ? (
                  <Skeleton width={100} height={32} />
                ) : (
                  <Text tw="text-4xl font-semibold">
                    ${priceToSellNext.data?.displayPrice}
                  </Text>
                )}
              </View>
            )}

            {/* <View>
              <Text tw="font-semibold text-green-500">^ $2.49 (25%) Month</Text>
            </View> */}
          </View>
        </View>
        <View
          tw="mt-4 flex-row items-center justify-between"
          style={{ columnGap: 16 }}
        >
          <Button
            tw="flex-1"
            style={{
              backgroundColor:
                selectedAction === "buy" ? "#08F6CC" : colors.gray[200],
            }}
            onPress={() => setSelectedAction("buy")}
          >
            <Text style={{ color: colors.black }} tw="font-semibold">
              Buy
            </Text>
          </Button>
          <Button
            tw="flex-1"
            style={{
              backgroundColor:
                selectedAction === "sell" ? colors.red[400] : colors.gray[200],
            }}
            onPress={() => setSelectedAction("sell")}
          >
            <Text style={{ color: colors.black }} tw="font-semibold">
              Sell
            </Text>
          </Button>
          <View>
            <InformationCircle color={colors.gray[400]} />
          </View>
        </View>
      </View>
      <View style={{ rowGap: 16 }} tw="mt-8">
        <View tw="flex-row justify-between">
          <Text tw="text-gray-700">You own:</Text>
          {tokenBalance.isLoading ? (
            <Skeleton width={40} height={14} />
          ) : (
            <Text tw="text-gray-700">{tokenBalance.data?.toString()}</Text>
          )}
        </View>
        <View tw="flex-row items-center">
          <Text tw="flex-2 text-gray-700">
            Quantity to {selectedAction === "buy" ? "buy" : "sell"}:
          </Text>
          <View tw="w-4" />
          <View tw="flex-1 flex-row rounded-sm border-[1px] border-gray-200">
            <View tw="flex-1 border-gray-200 p-4 text-center">
              <Text>{tokenAmount}</Text>
            </View>
            <Pressable
              onPress={() => {
                setTokenAmount((t) => (t > 1 ? t - 1 : 1));
              }}
              tw="flex-1 items-center border-[1px] border-transparent border-l-gray-200 border-r-gray-200 bg-blue-50 p-4"
            >
              <Text tw="text-2xl font-normal">-</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setTokenAmount((t) =>
                  selectedAction === "sell" &&
                  tokenBalance.data &&
                  t >= Number(tokenBalance.data)
                    ? t
                    : t + 1
                );
              }}
              tw="flex-1 items-center bg-blue-50 p-4"
            >
              <Text tw="text-2xl font-normal">+</Text>
            </Pressable>
          </View>
        </View>
        {/* <View tw="flex-row justify-between">
          <Text tw="text-gray-700">Estimated transaction fee:</Text>
          <Text tw="text-gray-700">$4.00</Text>
        </View> */}
        <View tw="flex-row justify-between">
          <Text tw="text-gray-700">
            {selectedAction === "buy"
              ? "You will pay in USDC:"
              : "You will receive in USDC:"}
          </Text>
          {selectedAction === "buy" ? (
            <>
              {priceToBuyNext.isLoading ? (
                <Skeleton width={40} height={14} />
              ) : (
                <Text tw="text-gray-700">
                  ${priceToBuyNext.data?.displayPrice}
                </Text>
              )}
            </>
          ) : (
            <>
              {priceToSellNext.isLoading ? (
                <Skeleton width={40} height={14} />
              ) : (
                <Text tw="text-gray-700">
                  ${priceToSellNext.data?.displayPrice}
                </Text>
              )}
            </>
          )}
        </View>
      </View>
      <View tw="h-8" />
      {renderBuyButton()}
    </View>
  );
};
