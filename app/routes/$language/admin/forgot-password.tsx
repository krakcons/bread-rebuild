import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$language/admin/forgot-password')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$language/admin/forgot-password"!</div>
}
