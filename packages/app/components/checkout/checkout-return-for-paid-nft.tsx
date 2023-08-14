import { useCallback, useContext, memo } from "react";

import { Button } from "@showtime-xyz/universal.button";
import { useEffectOnce } from "@showtime-xyz/universal.hooks";
import { useRouter } from "@showtime-xyz/universal.router";
import Spinner from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useJoinChannel } from "app/components/creator-channels/hooks/use-join-channel";
import { ClaimContext } from "app/context/claim-context";
import { usePaymentsManage } from "app/hooks/api/use-payments-manage";
import { useClaimNFT } from "app/hooks/use-claim-nft";
import {
  CreatorEditionResponse,
  useCreatorCollectionDetail,
} from "app/hooks/use-creator-collection-detail";
import { createParam } from "app/navigation/use-param";
import { delay } from "app/utilities";

import { stripePromise } from "../checkout/stripe";

const { useParam } = createParam<{
  contractAddress: string;
  isPaid?: string;
}>();

export const CheckoutReturnForPaidNFT = () => {
  const [contractAddress] = useParam("contractAddress");
  const { data: edition } = useCreatorCollectionDetail(contractAddress);
  if (!edition)
    return (
      <View tw="min-h-[200px] flex-1 items-center justify-center">
        <Spinner />
      </View>
    );
  return <CheckoutReturn edition={edition} />;
};

const CheckoutReturn = memo(function CheckoutReturn({
  edition,
}: {
  edition: CreatorEditionResponse;
}) {
  const joinChannel = useJoinChannel();

  const { state } = useContext(ClaimContext);

  const router = useRouter();
  const { claimNFT } = useClaimNFT(edition?.creator_airdrop_edition);

  const removeQueryParam = useCallback(() => {
    router.replace({ pathname: router.pathname }, undefined, {
      shallow: true,
    });
  }, [router]);
  const closeModal = useCallback(
    async (channelId?: number) => {
      await joinChannel.trigger({ channelId: channelId });
      const { asPath, pathname } = router;

      const pathWithoutQuery = asPath.split("?")[0];

      router.replace(
        {
          // Notes: Because we have rewritten the profile route pathname, we need to handle it specially.
          pathname: pathname.includes("/profile") ? pathWithoutQuery : pathname,
          query: {
            contractAddress: edition?.creator_airdrop_edition.contract_address,
            unlockedChannelModal: true,
          },
        },
        pathWithoutQuery,
        {
          shallow: true,
        }
      );
    },
    [edition?.creator_airdrop_edition.contract_address, joinChannel, router]
  );
  const { setPaymentByDefault } = usePaymentsManage();

  const handlePaymentSuccess = useCallback(async () => {
    const setAsDefaultPaymentMethod = new URLSearchParams(
      window.location.search
    ).get("setAsDefaultPaymentMethod");

    if (!setAsDefaultPaymentMethod) return;

    const stripe = await stripePromise();
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (stripe && clientSecret) {
      const res = await stripe.retrievePaymentIntent(clientSecret);
      if (typeof res.paymentIntent?.payment_method === "string") {
        setPaymentByDefault(res.paymentIntent.payment_method);
      }
    }
  }, [setPaymentByDefault]);

  const initPaidNFT = useCallback(async () => {
    handlePaymentSuccess();
    await delay(3000);
    await claimNFT({ closeModal });
  }, [claimNFT, closeModal, handlePaymentSuccess]);

  useEffectOnce(() => {
    initPaidNFT();
  });

  if (state.status === "error") {
    return (
      <View tw="min-h-[200px] flex-1 items-center justify-center px-8">
        <Text
          tw={`text-center text-lg font-extrabold leading-6 text-gray-900 dark:text-gray-100`}
        >
          {state.error}
        </Text>
        <Button tw="mt-4" onPress={removeQueryParam}>
          Got it.
        </Button>
      </View>
    );
  }
  return (
    <View tw="min-h-[200px] flex-1 items-center justify-center">
      <Spinner />
    </View>
  );
});
