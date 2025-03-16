import { Chat } from "@/components/chat/chat";

export default function Home() {
  return (
    <div className="flex flex-col h-screen p-4 md:p-8">
      <main className="flex-1 flex">
        <Chat />
      </main>
    </div>
  );
}
