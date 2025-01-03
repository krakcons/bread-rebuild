import { ProviderForm } from '@/components/forms/Provider'
import { buttonVariants } from '@/components/ui/Button'
import { getTranslations } from '@/lib/locale'
import { onboardProviderFn } from '@/server/actions/provider'
import { createFileRoute, ErrorComponent, Link } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/start'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/$locale/admin/onboarding')({
  component: RouteComponent,
  errorComponent: ErrorComponent,
})

function RouteComponent() {
  const onboardProviderMutation = useServerFn(onboardProviderFn)
  const { locale } = Route.useParams()
  const t = getTranslations(locale)

  return (
    <div className="mx-auto flex h-screen w-screen max-w-[600px] flex-col justify-center gap-4 p-4">
      <Link
        to="/$locale"
        params={{ locale }}
        className={buttonVariants({
          variant: 'link',
          class: 'self-start',
          size: 'auto',
        })}
      >
        <ArrowLeft size={20} />
        {t.common.back} {t.common.to} {t.common.bread}
      </Link>
      <h1>{t.admin.onboarding.title}</h1>
      <p className="text-sm text-muted-foreground">
        {t.admin.onboarding.description}
      </p>
      <ProviderForm
        locale={locale}
        onSubmit={async (data) => {
          await onboardProviderMutation({ data })
        }}
      />
    </div>
  )
}
