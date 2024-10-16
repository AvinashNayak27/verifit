import { Home, Trophy, Award, Gift ,Settings} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

export function NavigationBar() {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { icon: Home, path: "/dashboard" },
    { icon: Trophy, path: "/challenges" },
    { icon: Award, path: "/leaderboard" },
    { icon: Settings, path: "/settings" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t dark:bg-neutral-950">
      <div className="flex justify-around p-2">
        {navItems.map(({ icon: Icon, path }) => (
          <div
            key={path}
            className={`p-2 cursor-pointer transition-all duration-300 rounded-md ${
              pathname === path
                ? "bg-gray-200 dark:bg-gray-800"
                : "hover:bg-gray-100 dark:hover:bg-gray-900"
            }`}
            onClick={() => router.push(path)}
          >
            <Icon
              className={`h-6 w-6 transition-colors duration-300 ${
                pathname === path ? "text-primary" : "text-gray-500"
              }`}
            />
          </div>
        ))}
      </div>
    </nav>
  )
}
