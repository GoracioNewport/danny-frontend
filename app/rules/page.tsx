import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import RulesPanel from "@/components/rules-panel"

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="bg-gray-800/70 border-purple-700/30 text-white">
          <CardHeader>
            <Link href="/" className="text-purple-300 hover:text-purple-200 flex items-center gap-1 mb-4 w-fit">
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>
            <CardTitle className="text-2xl text-purple-300">Game Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <RulesPanel />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
