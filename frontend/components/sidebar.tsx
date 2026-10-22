import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="overflow-hidden border-r">
      <div className="flex flex-col">
        <Link href="/">Home</Link>
        <Link href="/mygpt">MyGpt</Link>
      </div>
      <p>hello sidebar</p>
    </aside>
  );
}
