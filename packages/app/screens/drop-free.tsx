import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { DropFree } from "app/components/drop/drop-free";

export const DropFreeScreen = withModalScreen(DropFree, {
  title: "Create a Drop",
  matchingPathname: "/drop/free",
  matchingQueryParam: "dropFree",
  tw: "w-full lg:w-[800px]",
  disableBackdropPress: true,
  snapPoints: ["100%"],
  headerShown: false,
  enableContentPanningGesture: false,
  enableHandlePanningGesture: false,
});
