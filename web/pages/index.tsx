import Link from 'next/link'

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">PersonaForge</h1>
      <nav className="space-x-4">
        <Link href="/login">Login</Link>
        <Link href="/signup">Signup</Link>
      </nav>
    </div>
  )
}
