import { Easing } from "react-native";

import { View as MotiView } from "moti";

import { getSpinnerSize, SpinnerView, SpinnerProps } from "./spinner-view";

const from = { rotate: "0deg" };
const animate = { rotate: "360deg" };
export const Spinner = ({ size, duration = 750, ...rest }: SpinnerProps) => {
  return (
    <MotiView
      from={from}
      animate={animate}
      transition={{
        type: "timing",
        loop: true,
        repeatReverse: false,
        easing: Easing.linear,
        duration,
        delay: 300,
      }}
      style={{
        height: getSpinnerSize(size),
        width: getSpinnerSize(size),
      }}
      accessibilityRole="progressbar"
    >
      <SpinnerView size={size} {...rest} />
    </MotiView>
  );
};
