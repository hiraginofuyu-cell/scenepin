import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "アニメ各話・名場面アーカイブ | ScenePin",
  description:
    "今期アニメと過去作品を、作品名・話数・人物・セリフ・出来事から横断検索できるScenePinのアニメアーカイブです。",
};

export default function AnimeArchiveLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
