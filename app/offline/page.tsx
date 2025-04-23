import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
      <h1 className="text-3xl font-bold mb-4">You are offline</h1>
      <p className="mb-6 text-gray-600">
        It looks like you&apos;re not connected to the internet. Some features may not be available.
      </p>
      <p className="mb-8">Don&apos;t worry, you can still use the Pomodoro Tracker with your existing session data.</p>
      <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
        Go to Home Page
      </Link>
    </div>
  )
}
