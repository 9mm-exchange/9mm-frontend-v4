import { ContextApi } from "@pancakeswap/localization";
import { FooterLinkType } from "../../../components/Footer/types";

export const footerLinks: (t: ContextApi["t"]) => FooterLinkType[] = (t) => [
  {
    label: t("Ecosystem"),
    items: [
      {
        label: t("Trade"),
        href: "https://dex.9mm.pro/swap",
      },
      {
        label: t("Earn"),
        href: "https://dex.9mm.pro/liquidity",
      },
      {
        label: t("Info & Analytics"),
        href: "https://dex.9mm.pro/info/v3",
      },
      {
        label: t("Revenue Sharing"),
        href: "https://9mm-pro.gitbook.io/9mm-pro/overview/revenue-sharing-model",
      },
      {
        label: t("Merchandise"),
        href: "https://pulsicanstore.com/collections/9mm-pro/",
      },
    ],
  },
  {
    label: "Business",
    items: [
      {
        label: t("9mm Incentives"),
        href: "https://9mm-pro.gitbook.io/9mm-pro/overview/revenue-sharing-model",
      },
      {
        label: t("Dex Aggregator"),
        href: "https://9x.9mm.pro",
      },
      {
        label: t("OTC Market"),
        href: "https://otc.9mm.pro",
      },
      {
        label: t("Explorer"),
        href: "https://scan.9mm.pro",
      },
    ],
  },
  {
    label: t("Developers"),
    items: [
      {
        label: t("Contributing"),
        href: "https://9mm-pro.gitbook.io/",
      },
      {
        label: t("Github"),
        href: "https://github.com/9mm-exchange",
      },
      {
        label: t("Bug Bounty"),
        href: "https://9mm-pro.gitbook.io/",
      },
      {
        label: t("V4 (soon)"),
        href: "#",
      },
    ],
  },
  {
    label: t("Support"),
    items: [
      {
        label: t("Get Help"),
        href: "https://t.me/ninemmpro",
      },
      {
        label: t("Troubleshooting"),
        href: "https://t.me/ninemmpro",
      },
      {
        label: t("Documentation"),
        href: "https://9mm-pro.gitbook.io/9mm-pro/",
      },
      {
        label: t("Audits"),
        href: "https://9mm-pro.gitbook.io/9mm-pro/audits",
      },
      {
        label: t("Legacy products"),
        href: "https://9mm-pro.gitbook.io/9mm-pro/overview/key-features-of-the-9mm-dex",
      },
    ],
  },
  {
    label: t("About"),
    items: [
      {
        label: t("Tokenomics"),
        href: "https://9mm-pro.gitbook.io/9mm-pro/overview/9mm-tokenomics",
      },
      {
        label: t("9mm Emission"),
        href: "#",
      },
      {
        label: t("Blog"),
        href: "#",
      },
      {
        label: t("Careers"),
        href: "#",
      },
      {
        label: t("Terms Of Service"),
        href: "https://dex.9mm.pro/terms-of-service",
      },
    ],
  },
];
