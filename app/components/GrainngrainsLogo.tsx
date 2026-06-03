import Image from "next/image";
import { Caveat } from "next/font/google";

import grainngrains from "@/public/grainngrains.svg";
import Link from "next/link";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export function GrainngrainsLogo({
  tagline,
  href = "/",
}: {
  tagline: string;
  href?: string;
}) {
  return (
    <Link href={href} className="shrink-0 flex flex-col items-start leading-none">
      <Image
        src={grainngrains}
        alt="logo"
        width={125}
        height={125}
        loading="eager"
        style={{ height: "auto" }}
      />
      <span className={`${caveat.className} text-sm font-light text-cyan-800`}>
        {tagline}
      </span>
    </Link>
  );
}
