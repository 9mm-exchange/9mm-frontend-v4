import { Language } from "../LangSelector/types";
import { DiscordIcon, GithubIcon, InstagramIcon, RedditIcon, TelegramIcon, TwitterIcon, YoutubeIcon } from "../Svg";
import { FooterLinkType } from "./types";

export const footerLinks: FooterLinkType[] = [
  {
    label: "About",
    items: [
      {
        label: "Contact",
        href: "https://t.me/ninemmpro",
      },
      {
        label: "Blog",
        href: "#",
      },
      {
        label: "Community",
        href: "https://t.me/ninemmpro",
      },
      {
        label: "9mm",
        href: "https://9mm-pro.gitbook.io/9mm-pro/overview/9mm-tokenomics",
      },
      {
        label: "—",
      },
      {
        label: "Online Store",
        href: "https://pulsicanstore.com/collections/9mm-pro/",
        isHighlighted: true,
      },
    ],
  },
  {
    label: "Help",
    items: [
      {
        label: "Customer",
        href: "https://t.me/ninemmpro",
      },
      {
        label: "Troubleshooting",
        href: "https://t.me/ninemmpro",
      },
      {
        label: "Guides",
        href: "https://9mm-pro.gitbook.io/9mm-pro",
      },
    ],
  },
  {
    label: "Developers",
    items: [
      {
        label: "Github",
        href: "https://9mm-pro.gitbook.io/9mm-pro",
      },
      {
        label: "Documentation",
        href: "https://9mm-pro.gitbook.io/9mm-pro",
      },
      {
        label: "Bug Bounty",
        href: "https://9mm-pro.gitbook.io/9mm-pro",
      },
      {
        label: "Audits",
        href: "https://9mm-pro.gitbook.io/9mm-pro/audits",
      },
      {
        label: "Careers",
        href: "https://9mm-pro.gitbook.io/9mm-pro/conclusion/join-the-community",
      },
    ],
  },
];

export const socials = [
  {
    label: "Twitter",
    icon: TwitterIcon,
    href: "https://x.com/9mm_pro",
  },
  {
    label: "Telegram",
    icon: TelegramIcon,
    href: "https://t.me/ninemmpro",
  },
  {
    label: "Reddit",
    icon: RedditIcon,
    href: "#",
  },
  {
    label: "Instagram",
    icon: InstagramIcon,
    href: "#",
  },
  {
    label: "Github",
    icon: GithubIcon,
    href: "https://github.com/orgs/9mm-exchange",
  },
  {
    label: "Discord",
    icon: DiscordIcon,
    href: "#",
  },
  {
    label: "Youtube",
    icon: YoutubeIcon,
    href: "#",
  },
];

export const langs: Language[] = [...Array(20)].map((_, i) => ({
  code: `en${i}`,
  language: `English${i}`,
  locale: `Locale${i}`,
}));
