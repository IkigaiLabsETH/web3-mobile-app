import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

import { GatingType } from "app/types";

import { colors } from "design-system/tailwind/colors";

export const config = {
  runtime: "edge",
};
const baseURL = __DEV__
  ? "http://localhost:3000"
  : `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}`;

const fontSemiBold = fetch(`${baseURL}/assets/Inter-SemiBold.otf`).then((res) =>
  res.arrayBuffer()
);
const fontBold = fetch(`${baseURL}/assets/Inter-Bold.otf`).then((res) =>
  res.arrayBuffer()
);
const fontRegular = fetch(`${baseURL}/assets/Inter-Regular.otf`).then((res) =>
  res.arrayBuffer()
);
const getGatingTypeLinearGradient = (gatingType: GatingType) => {
  if (gatingType === "paid_nft") {
    return "linear-gradient(158deg, #F4CE5E 23.96%, #F4CE5E 54.12%, #F1A819 69.63%, #FFD480 82.36%, #FBC73F 91.83%, #F5E794 99.79%)";
  }
  return "linear-gradient(154deg, #00E786 0%, #4B27FE 36.26%, #B013D8 100%)";
};
const getGatingTypeTextColor = (gatingType: GatingType) => {
  if (gatingType === "paid_nft") {
    return colors.gray[900];
  }
  return "#FFF";
};
const getGatingTypeLabel = (gatingType: GatingType) => {
  if (gatingType === "paid_nft") {
    return "Collect to unlock channel";
  }
  if (
    gatingType === "multi_provider_music_presave" ||
    gatingType === "music_presave" ||
    gatingType === "spotify_presave"
  ) {
    return "Presave to collect";
  }
  if (
    gatingType === "spotify_save" ||
    gatingType === "multi_provider_music_save"
  ) {
    return "Save to collect";
  }
  return null;
};
const getGatingTypeIcon = (gatingType: GatingType) => {
  if (gatingType === "paid_nft") {
    return (
      <svg
        width="16"
        height="21"
        viewBox="0 0 16 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.2204 9.99951H2.94299C2.19115 9.99951 1.58167 10.6012 1.58167 11.3433V17.6556C1.58167 18.3978 2.19115 18.9995 2.94299 18.9995H13.2204C13.9722 18.9995 14.5817 18.3978 14.5817 17.6556V11.3433C14.5817 10.6012 13.9722 9.99951 13.2204 9.99951Z"
          fill="#FFD554"
          stroke="#FFD554"
          strokeWidth="2.90522"
        />
        <path
          d="M12.4811 9.29053V6.6641C12.5016 5.20665 11.6318 2.29053 7.99216 2.29053C4.76542 2.29053 3.68444 4.58303 3.48145 6.11874"
          stroke="#FFD554"
          strokeWidth="4.35783"
        />
      </svg>
    );
  }
  if (
    gatingType === "multi_provider_music_presave" ||
    gatingType === "music_presave" ||
    gatingType === "spotify_presave" ||
    gatingType === "spotify_save" ||
    gatingType === "multi_provider_music_save"
  ) {
    return (
      <svg
        width="16"
        height="21"
        viewBox="0 0 16 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.71437 1.87539L14.6306 0.0236241C15.3389 -0.123485 16.0004 0.435112 16 1.18002L15.992 15.4868C15.9911 17.0355 14.941 18.3733 13.4719 18.6971L13.0538 18.7892C11.5713 19.1159 10.1739 17.9507 10.1739 16.3879C10.1739 15.2511 10.9369 14.2656 12.0121 14.0135L13.8221 13.5892C14.4112 13.4512 14.8293 12.9112 14.8293 12.2884V5.80456C14.8293 5.35305 14.4276 5.01504 13.9985 5.10543L6.57303 6.66973C6.13873 6.76119 5.82688 7.15503 5.82688 7.61199V17.6021C5.82688 19.1484 4.79713 20.4925 3.33802 20.8506L3.0136 20.9303C1.47606 21.3076 0 20.1057 0 18.4763C0 17.3592 0.753937 16.3925 1.81226 16.1527L3.65964 15.7342C4.25311 15.5997 4.67589 15.0577 4.67589 14.4312V3.18318C4.67589 2.54796 5.11034 2.00084 5.71437 1.87539Z"
          fill="white"
        />
      </svg>
    );
  }

  return null;
};
const getGatingTypeColor = (gatingType: GatingType) => {
  if (gatingType === "paid_nft") {
    return "#FFD554";
  }

  return "#FFF";
};
export default async function handler(req: NextRequest) {
  const { search } = req.nextUrl;

  const paramsString = decodeURIComponent(search).replace(/&amp;/g, "&");
  const searchParams = new URLSearchParams(paramsString);
  const username = searchParams.get("username");
  const image = searchParams.get("image");
  const pfp = searchParams.get("pfp");
  const desc = searchParams.get("desc");
  const gatingType = searchParams.get("gatingType") as GatingType;

  const fontBoldData = await fontBold;
  const fontSemiBoldData = await fontSemiBold;
  const fontRegularData = await fontRegular;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          color: getGatingTypeTextColor(gatingType),
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            display: "flex",
            backgroundImage: getGatingTypeLinearGradient(gatingType),
          }}
        >
          <div
            style={{
              display: "flex",
              marginLeft: 40,
              width: 320,
              height: 320,
              position: "relative",
              borderRadius: "24px",
              overflow: "hidden",
            }}
          >
            <img
              src={image}
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
              }}
            />
            {getGatingTypeLabel(gatingType) ? (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  height: "50px",
                  background: "#000",
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {getGatingTypeIcon(gatingType)}

                <p
                  style={{
                    color: getGatingTypeColor(gatingType),
                    fontSize: "17px",
                    fontWeight: 600,
                    lineHeight: "50px",
                    marginLeft: 8,
                  }}
                >
                  {getGatingTypeLabel(gatingType)}
                </p>
              </div>
            ) : null}
          </div>

          <div
            style={{
              display: "flex",
              flex: 1,
              marginLeft: "20px",
              paddingRight: "16px",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
              paddingTop: "32px",
              paddingBottom: "44px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <img
                src={pfp}
                style={{
                  width: "38px",
                  height: "38px",
                  display: "flex",
                  borderRadius: "999px",
                  marginRight: 8,
                }}
              />
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                }}
              >
                @{username}
              </p>
            </div>
            <p
              style={{
                fontWeight: 400,
                fontSize: "22px",
                width: "auto",
                textAlign: "center",
                wordBreak: "break-word",
                alignSelf: "center",
              }}
            >
              {desc}
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  display: "flex",
                  alignSelf: "center",
                  marginBottom: "16px",
                }}
              >
                Collect on
              </div>
              <svg
                width="190"
                height="28"
                viewBox="0 0 190 28"
                fill={getGatingTypeTextColor(gatingType)}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M60.7301 0.185994C60.7301 0.0833278 60.6468 0 60.5441 0H56.4468C56.3434 0 56.2601 0.0833278 56.2601 0.185994V25.1447C56.2601 25.248 56.3434 25.3313 56.4468 25.3313H60.5441C60.6468 25.3313 60.7301 25.248 60.7301 25.1447V10.9893C60.7301 10.886 60.8141 10.8027 60.9167 10.8027H64.4554C66.5128 10.8027 68.1807 12.4707 68.1807 14.528V25.1447C68.1807 25.248 68.2641 25.3313 68.3668 25.3313H72.4647C72.5674 25.3313 72.6507 25.248 72.6507 25.1447V14.528C72.6507 10.002 68.9821 6.33268 64.4554 6.33268H60.9167C60.8141 6.33268 60.7301 6.24933 60.7301 6.146V0.185994Z" />
                <path d="M136.725 6.8913C136.725 6.78863 136.808 6.70526 136.911 6.70526H141.009C141.111 6.70526 141.195 6.78863 141.195 6.8913V25.1446C141.195 25.248 141.111 25.3313 141.009 25.3313H136.911C136.808 25.3313 136.725 25.248 136.725 25.1446V6.8913Z" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M93.5121 16.018C93.5121 21.3674 89.1761 25.7033 83.8268 25.7033C78.4774 25.7033 74.1414 21.3674 74.1414 16.018C74.1414 10.6687 78.4774 6.3327 83.8268 6.3327C89.1761 6.3327 93.5121 10.6687 93.5121 16.018ZM89.0421 16.018C89.0421 18.8987 86.7068 21.2334 83.8268 21.2334C80.9461 21.2334 78.6114 18.8987 78.6114 16.018C78.6114 13.138 80.9461 10.8027 83.8268 10.8027C86.7068 10.8027 89.0421 13.138 89.0421 16.018Z"
                />
                <path d="M125.363 6.70532C125.465 6.70532 125.549 6.62201 125.549 6.51868V0.185994C125.549 0.0833278 125.632 0 125.735 0H129.833C129.935 0 130.019 0.0833278 130.019 0.185994V6.51868C130.019 6.62201 130.103 6.70532 130.205 6.70532H134.303C134.406 6.70532 134.489 6.78869 134.489 6.89136V10.9893C134.489 11.092 134.406 11.1753 134.303 11.1753H130.205C130.103 11.1753 130.019 11.2587 130.019 11.3613V18.626C130.019 19.86 131.02 20.8607 132.254 20.8607H134.303C134.406 20.8607 134.489 20.944 134.489 21.0473V25.1447C134.489 25.248 134.406 25.3313 134.303 25.3313H132.254C128.551 25.3313 125.549 22.3293 125.549 18.626V11.3613C125.549 11.2587 125.465 11.1753 125.363 11.1753H122.755C122.652 11.1753 122.569 11.092 122.569 10.9893V6.89136C122.569 6.78869 122.652 6.70532 122.755 6.70532H125.363Z" />
                <path d="M44.1534 6.70526C40.9641 6.70526 38.3794 9.28993 38.3794 12.4793C38.3794 15.6679 40.9641 18.2533 44.1534 18.2533H48.9961C49.7161 18.2533 50.3 18.8366 50.3 19.5573C50.3 20.2773 49.7161 20.8606 48.9961 20.8606H38.5654C38.4627 20.8606 38.3794 20.9439 38.3794 21.0473V25.1446C38.3794 25.248 38.4627 25.3313 38.5654 25.3313H48.9961C52.1847 25.3313 54.7701 22.7459 54.7701 19.5573C54.7701 16.3679 52.1847 13.7826 48.9961 13.7826H44.1534C43.4334 13.7826 42.8494 13.1993 42.8494 12.4793C42.8494 11.7593 43.4334 11.1753 44.1534 11.1753H53.4661C53.5694 11.1753 53.6527 11.0919 53.6527 10.9893V6.8913C53.6527 6.78863 53.5694 6.70526 53.4661 6.70526H44.1534Z" />
                <path d="M94.4774 6.70526C94.3614 6.70526 94.2734 6.81061 94.2941 6.92527L97.6694 25.1786C97.6854 25.2666 97.7627 25.3313 97.8521 25.3313H105.218C105.308 25.3313 105.385 25.2666 105.401 25.1786L107.685 12.8273C107.723 12.6246 108.014 12.6246 108.051 12.8273L110.335 25.1786C110.351 25.2673 110.428 25.3313 110.518 25.3313H117.884C117.974 25.3313 118.051 25.2666 118.067 25.1786L121.442 6.92527C121.463 6.81061 121.375 6.70526 121.259 6.70526H117.092C117.002 6.70526 116.925 6.76928 116.909 6.85728L114.341 20.744C114.329 20.812 114.27 20.8606 114.201 20.8606C114.133 20.8606 114.073 20.812 114.061 20.744L111.493 6.85728C111.477 6.76928 111.4 6.70526 111.31 6.70526H104.426C104.336 6.70526 104.259 6.76928 104.243 6.85728L101.675 20.7446C101.663 20.8119 101.604 20.8606 101.535 20.8606C101.467 20.8606 101.408 20.8119 101.395 20.7446L98.8281 6.85728C98.8114 6.76928 98.7348 6.70526 98.6448 6.70526H94.4774Z" />
                <path d="M158.144 25.3313C158.247 25.3313 158.331 25.248 158.331 25.1446V11.3613C158.331 11.2586 158.414 11.1753 158.517 11.1753H161.311C162.957 11.1753 164.291 12.5093 164.291 14.1553V25.1446C164.291 25.248 164.374 25.3313 164.477 25.3313H168.575C168.678 25.3313 168.761 25.248 168.761 25.1446V14.1553C168.761 10.0406 165.425 6.70526 161.311 6.70526H143.616C143.513 6.70526 143.43 6.78863 143.43 6.8913V25.1446C143.43 25.248 143.513 25.3313 143.616 25.3313H147.714C147.817 25.3313 147.9 25.248 147.9 25.1446V11.3613C147.9 11.2586 147.983 11.1753 148.086 11.1753H150.88C152.525 11.1753 153.859 12.5086 153.86 14.1533V25.1446C153.86 25.248 153.944 25.3313 154.047 25.3313H158.144Z" />
                <path d="M136.725 1.30337C136.725 1.2007 136.808 1.11737 136.911 1.11737H141.009C141.111 1.11737 141.195 1.2007 141.195 1.30337V5.02871C141.195 5.13137 141.111 5.21535 141.009 5.21535H136.911C136.808 5.21535 136.725 5.13137 136.725 5.02871V1.30337Z" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M179.94 21.2334C177.66 21.2334 175.727 19.7774 175.015 17.746C174.973 17.628 175.063 17.508 175.187 17.508H189.433C189.54 17.508 189.62 17.4247 189.62 17.322V16.018C189.62 10.6687 185.287 6.3327 179.94 6.3327C174.587 6.3327 170.251 10.6687 170.251 16.018C170.251 21.3674 174.587 25.7033 179.94 25.7033C182.58 25.7033 185.14 24.6434 187.053 22.9654C187.74 22.364 188.353 21.6653 188.867 20.8873C188.933 20.79 188.887 20.6587 188.78 20.616L184.807 19.0707C184.733 19.0427 184.653 19.0634 184.6 19.1214C184.447 19.2894 184.28 19.4514 184.1 19.6074C182.94 20.626 181.407 21.2334 179.94 21.2334ZM179.94 10.8027C182.213 10.8027 184.147 12.2594 184.86 14.2907C184.9 14.408 184.813 14.528 184.687 14.528H175.187C175.063 14.528 174.973 14.408 175.015 14.2907C175.727 12.2594 177.66 10.8027 179.94 10.8027Z"
                />
                <path d="M25.0295 15.7479C25.5868 15.5092 25.5868 14.7199 25.0295 14.4806L21.2935 12.8799C18.4468 11.6599 16.1788 9.39123 14.9588 6.54457L13.3575 2.80856C13.1188 2.25123 12.3288 2.25123 12.0901 2.80856L10.4888 6.54457C9.26883 9.39123 7.00082 11.6599 4.15415 12.8799L0.4175 14.4806C-0.139167 14.7199 -0.139167 15.5092 0.4175 15.7479L4.15415 17.3492C7.00082 18.5692 9.26883 20.8372 10.4888 23.6839L12.0901 27.4206C12.3288 27.9772 13.1188 27.9772 13.3575 27.4206L14.9588 23.6839C16.1788 20.8372 18.4468 18.5692 21.2935 17.3492L25.0295 15.7479Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 800,
      height: 400,
      fonts: [
        {
          name: "Inter",
          data: fontRegularData,
          weight: 400,
          style: "normal",
        },
        {
          name: "Inter",
          data: fontSemiBoldData,
          weight: 600,
          style: "normal",
        },
        {
          name: "Inter",
          data: fontBoldData,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );
}
