import { createFileRoute, ErrorComponent } from '@tanstack/react-router'

export const Route = createFileRoute('/$locale/admin/_admin/')({
  component: RouteComponent,
  errorComponent: ErrorComponent,
})

function RouteComponent() {
  return <div>Hello "/$locale/admin/_admin"!</div>
}
