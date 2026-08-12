import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BLEACH 全366話検索 | ScenePin",
  description: "BLEACHの全366話を、タイトル・登場人物・技・篇から検索できます。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
