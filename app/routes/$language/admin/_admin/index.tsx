import { Button } from '@/components/ui/Button'
import { logout } from '@/server/auth/actions'
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/start'

export const Route = createFileRoute('/$language/admin/_admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  const logoutFn = useServerFn(logout)

  return (
    <div>
      Hello "/$language/admin/"!
      <Button onClick={() => logoutFn()}>Logout</Button>
    </div>
  )
}
