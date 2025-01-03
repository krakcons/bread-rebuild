import { NotFound } from '@/components/NotFound'
import { Button, buttonVariants } from '@/components/ui/Button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover'
import { getTranslations } from '@/lib/locale'
import { cn } from '@/lib/utils'
import { getSavedFn } from '@/server/actions/saved'
import { useQuery } from '@tanstack/react-query'
import {
  createFileRoute,
  ErrorComponent,
  Link,
  Outlet,
} from '@tanstack/react-router'
import { Bookmark, Menu, Printer } from 'lucide-react'

export const Route = createFileRoute('/$locale/_app')({
  component: LayoutComponent,
  errorComponent: ErrorComponent,
  notFoundComponent: NotFound,
})

function LayoutComponent() {
  const { locale } = Route.useParams()
  const navigate = Route.useNavigate()
  const translations = getTranslations(locale)
  const { data: saved } = useQuery({
    queryKey: ['saved'],
    queryFn: () => getSavedFn(),
  })

  return (
    <div>
      <div className="flex items-center justify-center border-b">
        <header className="flex w-full max-w-screen-md items-center justify-between gap-4 px-4 py-3">
          <Link
            to="/$locale"
            params={{ locale }}
            className="flex items-center gap-2"
          >
            <img src="/logo.png" alt="Bread Logo" className="w-12" />
            <p className="print font-semibold tracking-widest text-primary sm:text-xl">
              BREAD
            </p>
          </Link>
          <div className="no-print flex items-center gap-2">
            <Link
              to="/$locale/saved"
              params={{ locale }}
              className={cn(buttonVariants(), 'relative rounded-full')}
            >
              <Bookmark size={20} />
              <p className="hidden sm:block">{translations.saved.title}</p>
              {saved && saved.filter((s) => !s.seen).length > 0 && (
                <span className="absolute left-[22px] top-1 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-secondary text-xs text-white">
                  {saved.filter((s) => !s.seen).length}
                </span>
              )}
            </Link>
            <Button
              onClick={() => {
                window.print()
              }}
              className="rounded-full"
            >
              <Printer size={20} />
              <p className="hidden sm:block">{translations.print}</p>
            </Button>
            <Button
              onClick={() => {
                navigate({
                  replace: true,
                  params: {
                    locale: locale === 'en' ? 'fr' : 'en',
                  },
                  search: (prev) => ({ ...prev }),
                })
              }}
              size="icon"
              className="rounded-full"
            >
              {locale === 'en' ? 'FR' : 'EN'}
            </Button>
            <Popover>
              <PopoverTrigger
                className={cn(
                  buttonVariants({
                    size: 'icon',
                  }),
                  'rounded-full',
                )}
              >
                <Menu size={18} />
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className={cn(
                  'flex flex-col gap-2',
                  locale === 'fr' ? 'w-64' : 'w-48',
                )}
              >
                <Link
                  to="/$locale/terms"
                  params={{ locale }}
                  className="text-center"
                >
                  {translations.terms}
                </Link>
                <Link
                  to="/$locale/privacy-policy"
                  params={{ locale }}
                  className="text-center"
                >
                  {translations.privacy}
                </Link>
                <Link
                  to="/$locale/admin"
                  params={{ locale }}
                  className="text-center"
                >
                  {translations.admin.title}
                </Link>
              </PopoverContent>
            </Popover>
          </div>
        </header>
      </div>
      <div className="mx-auto max-w-screen-md p-4">
        <Outlet />
      </div>
    </div>
  )
}
