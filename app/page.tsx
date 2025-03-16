import { Chat } from "@/components/chat"

// Add a key with the current timestamp to force a complete refresh
export default function Home() {
  // Use server-side rendering to ensure the component is fresh on each page load
  const timestamp = Date.now()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Chat key={timestamp} />
    </main>
  )
}
