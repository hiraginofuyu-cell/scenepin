import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "水曜日のダウンタウン 2025年説一覧｜ScenePin",
  description:
    "水曜日のダウンタウンの2025年放送回・説・企画・プレゼンター・検証結果を放送日ごとに検索できる一覧。",
};

export default function ArchiveLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
