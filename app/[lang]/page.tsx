import FlavorWheel from "../components/FlavorWheel";
import { isLocale, DEFAULT_LOCALE } from "../i18n/config";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  return (
    <main
      className="min-h-screen flex flex-col items-center"
      style={{ background: "#faf6f2" }}
    >
      <FlavorWheel config={{ active: "sca", locale }} />
    </main>
  );
}
