/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LocaleAdminImport } from './routes/$locale/admin'
import { Route as LocaleAppImport } from './routes/$locale/_app'
import { Route as LocaleAppIndexImport } from './routes/$locale/_app/index'
import { Route as LocaleAdminVerifyEmailImport } from './routes/$locale/admin/verify-email'
import { Route as LocaleAdminSignupImport } from './routes/$locale/admin/signup'
import { Route as LocaleAdminResetPasswordImport } from './routes/$locale/admin/reset-password'
import { Route as LocaleAdminOnboardingImport } from './routes/$locale/admin/onboarding'
import { Route as LocaleAdminLoginImport } from './routes/$locale/admin/login'
import { Route as LocaleAdminAdminImport } from './routes/$locale/admin/_admin'
import { Route as LocaleAppTermsImport } from './routes/$locale/_app/terms'
import { Route as LocaleAppSavedImport } from './routes/$locale/_app/saved'
import { Route as LocaleAppPrivacyPolicyImport } from './routes/$locale/_app/privacy-policy'
import { Route as LocaleAppFaqImport } from './routes/$locale/_app/faq'
import { Route as LocaleAdminAdminIndexImport } from './routes/$locale/admin/_admin/index'
import { Route as LocaleAdminAdminAnalyticsImport } from './routes/$locale/admin/_admin/analytics'
import { Route as LocaleAppResourcesIdImport } from './routes/$locale/_app/resources/$id'
import { Route as LocaleAdminAdminProvidersMeImport } from './routes/$locale/admin/_admin/providers/me'
import { Route as LocaleAdminAdminProvidersListImport } from './routes/$locale/admin/_admin/providers/list'
import { Route as LocaleAdminAdminProvidersIdImport } from './routes/$locale/admin/_admin/providers/$id'
import { Route as LocaleAdminAdminListingsNewImport } from './routes/$locale/admin/_admin/listings/new'
import { Route as LocaleAdminAdminListingsListImport } from './routes/$locale/admin/_admin/listings/list'
import { Route as LocaleAdminAdminListingsIdImport } from './routes/$locale/admin/_admin/listings/$id'

// Create Virtual Routes

const LocaleImport = createFileRoute('/$locale')()

// Create/Update Routes

const LocaleRoute = LocaleImport.update({
  id: '/$locale',
  path: '/$locale',
  getParentRoute: () => rootRoute,
} as any)

const LocaleAdminRoute = LocaleAdminImport.update({
  id: '/admin',
  path: '/admin',
  getParentRoute: () => LocaleRoute,
} as any)

const LocaleAppRoute = LocaleAppImport.update({
  id: '/_app',
  getParentRoute: () => LocaleRoute,
} as any)

const LocaleAppIndexRoute = LocaleAppIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => LocaleAppRoute,
} as any)

const LocaleAdminVerifyEmailRoute = LocaleAdminVerifyEmailImport.update({
  id: '/verify-email',
  path: '/verify-email',
  getParentRoute: () => LocaleAdminRoute,
} as any)

const LocaleAdminSignupRoute = LocaleAdminSignupImport.update({
  id: '/signup',
  path: '/signup',
  getParentRoute: () => LocaleAdminRoute,
} as any)

const LocaleAdminResetPasswordRoute = LocaleAdminResetPasswordImport.update({
  id: '/reset-password',
  path: '/reset-password',
  getParentRoute: () => LocaleAdminRoute,
} as any)

const LocaleAdminOnboardingRoute = LocaleAdminOnboardingImport.update({
  id: '/onboarding',
  path: '/onboarding',
  getParentRoute: () => LocaleAdminRoute,
} as any)

const LocaleAdminLoginRoute = LocaleAdminLoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => LocaleAdminRoute,
} as any)

const LocaleAdminAdminRoute = LocaleAdminAdminImport.update({
  id: '/_admin',
  getParentRoute: () => LocaleAdminRoute,
} as any)

const LocaleAppTermsRoute = LocaleAppTermsImport.update({
  id: '/terms',
  path: '/terms',
  getParentRoute: () => LocaleAppRoute,
} as any)

const LocaleAppSavedRoute = LocaleAppSavedImport.update({
  id: '/saved',
  path: '/saved',
  getParentRoute: () => LocaleAppRoute,
} as any)

const LocaleAppPrivacyPolicyRoute = LocaleAppPrivacyPolicyImport.update({
  id: '/privacy-policy',
  path: '/privacy-policy',
  getParentRoute: () => LocaleAppRoute,
} as any)

const LocaleAppFaqRoute = LocaleAppFaqImport.update({
  id: '/faq',
  path: '/faq',
  getParentRoute: () => LocaleAppRoute,
} as any)

const LocaleAdminAdminIndexRoute = LocaleAdminAdminIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => LocaleAdminAdminRoute,
} as any)

const LocaleAdminAdminAnalyticsRoute = LocaleAdminAdminAnalyticsImport.update({
  id: '/analytics',
  path: '/analytics',
  getParentRoute: () => LocaleAdminAdminRoute,
} as any)

const LocaleAppResourcesIdRoute = LocaleAppResourcesIdImport.update({
  id: '/resources/$id',
  path: '/resources/$id',
  getParentRoute: () => LocaleAppRoute,
} as any)

const LocaleAdminAdminProvidersMeRoute =
  LocaleAdminAdminProvidersMeImport.update({
    id: '/providers/me',
    path: '/providers/me',
    getParentRoute: () => LocaleAdminAdminRoute,
  } as any)

const LocaleAdminAdminProvidersListRoute =
  LocaleAdminAdminProvidersListImport.update({
    id: '/providers/list',
    path: '/providers/list',
    getParentRoute: () => LocaleAdminAdminRoute,
  } as any)

const LocaleAdminAdminProvidersIdRoute =
  LocaleAdminAdminProvidersIdImport.update({
    id: '/providers/$id',
    path: '/providers/$id',
    getParentRoute: () => LocaleAdminAdminRoute,
  } as any)

const LocaleAdminAdminListingsNewRoute =
  LocaleAdminAdminListingsNewImport.update({
    id: '/listings/new',
    path: '/listings/new',
    getParentRoute: () => LocaleAdminAdminRoute,
  } as any)

const LocaleAdminAdminListingsListRoute =
  LocaleAdminAdminListingsListImport.update({
    id: '/listings/list',
    path: '/listings/list',
    getParentRoute: () => LocaleAdminAdminRoute,
  } as any)

const LocaleAdminAdminListingsIdRoute = LocaleAdminAdminListingsIdImport.update(
  {
    id: '/listings/$id',
    path: '/listings/$id',
    getParentRoute: () => LocaleAdminAdminRoute,
  } as any,
)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/$locale': {
      id: '/$locale'
      path: '/$locale'
      fullPath: '/$locale'
      preLoaderRoute: typeof LocaleImport
      parentRoute: typeof rootRoute
    }
    '/$locale/_app': {
      id: '/$locale/_app'
      path: '/$locale'
      fullPath: '/$locale'
      preLoaderRoute: typeof LocaleAppImport
      parentRoute: typeof LocaleRoute
    }
    '/$locale/admin': {
      id: '/$locale/admin'
      path: '/admin'
      fullPath: '/$locale/admin'
      preLoaderRoute: typeof LocaleAdminImport
      parentRoute: typeof LocaleImport
    }
    '/$locale/_app/faq': {
      id: '/$locale/_app/faq'
      path: '/faq'
      fullPath: '/$locale/faq'
      preLoaderRoute: typeof LocaleAppFaqImport
      parentRoute: typeof LocaleAppImport
    }
    '/$locale/_app/privacy-policy': {
      id: '/$locale/_app/privacy-policy'
      path: '/privacy-policy'
      fullPath: '/$locale/privacy-policy'
      preLoaderRoute: typeof LocaleAppPrivacyPolicyImport
      parentRoute: typeof LocaleAppImport
    }
    '/$locale/_app/saved': {
      id: '/$locale/_app/saved'
      path: '/saved'
      fullPath: '/$locale/saved'
      preLoaderRoute: typeof LocaleAppSavedImport
      parentRoute: typeof LocaleAppImport
    }
    '/$locale/_app/terms': {
      id: '/$locale/_app/terms'
      path: '/terms'
      fullPath: '/$locale/terms'
      preLoaderRoute: typeof LocaleAppTermsImport
      parentRoute: typeof LocaleAppImport
    }
    '/$locale/admin/_admin': {
      id: '/$locale/admin/_admin'
      path: ''
      fullPath: '/$locale/admin'
      preLoaderRoute: typeof LocaleAdminAdminImport
      parentRoute: typeof LocaleAdminImport
    }
    '/$locale/admin/login': {
      id: '/$locale/admin/login'
      path: '/login'
      fullPath: '/$locale/admin/login'
      preLoaderRoute: typeof LocaleAdminLoginImport
      parentRoute: typeof LocaleAdminImport
    }
    '/$locale/admin/onboarding': {
      id: '/$locale/admin/onboarding'
      path: '/onboarding'
      fullPath: '/$locale/admin/onboarding'
      preLoaderRoute: typeof LocaleAdminOnboardingImport
      parentRoute: typeof LocaleAdminImport
    }
    '/$locale/admin/reset-password': {
      id: '/$locale/admin/reset-password'
      path: '/reset-password'
      fullPath: '/$locale/admin/reset-password'
      preLoaderRoute: typeof LocaleAdminResetPasswordImport
      parentRoute: typeof LocaleAdminImport
    }
    '/$locale/admin/signup': {
      id: '/$locale/admin/signup'
      path: '/signup'
      fullPath: '/$locale/admin/signup'
      preLoaderRoute: typeof LocaleAdminSignupImport
      parentRoute: typeof LocaleAdminImport
    }
    '/$locale/admin/verify-email': {
      id: '/$locale/admin/verify-email'
      path: '/verify-email'
      fullPath: '/$locale/admin/verify-email'
      preLoaderRoute: typeof LocaleAdminVerifyEmailImport
      parentRoute: typeof LocaleAdminImport
    }
    '/$locale/_app/': {
      id: '/$locale/_app/'
      path: '/'
      fullPath: '/$locale/'
      preLoaderRoute: typeof LocaleAppIndexImport
      parentRoute: typeof LocaleAppImport
    }
    '/$locale/_app/resources/$id': {
      id: '/$locale/_app/resources/$id'
      path: '/resources/$id'
      fullPath: '/$locale/resources/$id'
      preLoaderRoute: typeof LocaleAppResourcesIdImport
      parentRoute: typeof LocaleAppImport
    }
    '/$locale/admin/_admin/analytics': {
      id: '/$locale/admin/_admin/analytics'
      path: '/analytics'
      fullPath: '/$locale/admin/analytics'
      preLoaderRoute: typeof LocaleAdminAdminAnalyticsImport
      parentRoute: typeof LocaleAdminAdminImport
    }
    '/$locale/admin/_admin/': {
      id: '/$locale/admin/_admin/'
      path: '/'
      fullPath: '/$locale/admin/'
      preLoaderRoute: typeof LocaleAdminAdminIndexImport
      parentRoute: typeof LocaleAdminAdminImport
    }
    '/$locale/admin/_admin/listings/$id': {
      id: '/$locale/admin/_admin/listings/$id'
      path: '/listings/$id'
      fullPath: '/$locale/admin/listings/$id'
      preLoaderRoute: typeof LocaleAdminAdminListingsIdImport
      parentRoute: typeof LocaleAdminAdminImport
    }
    '/$locale/admin/_admin/listings/list': {
      id: '/$locale/admin/_admin/listings/list'
      path: '/listings/list'
      fullPath: '/$locale/admin/listings/list'
      preLoaderRoute: typeof LocaleAdminAdminListingsListImport
      parentRoute: typeof LocaleAdminAdminImport
    }
    '/$locale/admin/_admin/listings/new': {
      id: '/$locale/admin/_admin/listings/new'
      path: '/listings/new'
      fullPath: '/$locale/admin/listings/new'
      preLoaderRoute: typeof LocaleAdminAdminListingsNewImport
      parentRoute: typeof LocaleAdminAdminImport
    }
    '/$locale/admin/_admin/providers/$id': {
      id: '/$locale/admin/_admin/providers/$id'
      path: '/providers/$id'
      fullPath: '/$locale/admin/providers/$id'
      preLoaderRoute: typeof LocaleAdminAdminProvidersIdImport
      parentRoute: typeof LocaleAdminAdminImport
    }
    '/$locale/admin/_admin/providers/list': {
      id: '/$locale/admin/_admin/providers/list'
      path: '/providers/list'
      fullPath: '/$locale/admin/providers/list'
      preLoaderRoute: typeof LocaleAdminAdminProvidersListImport
      parentRoute: typeof LocaleAdminAdminImport
    }
    '/$locale/admin/_admin/providers/me': {
      id: '/$locale/admin/_admin/providers/me'
      path: '/providers/me'
      fullPath: '/$locale/admin/providers/me'
      preLoaderRoute: typeof LocaleAdminAdminProvidersMeImport
      parentRoute: typeof LocaleAdminAdminImport
    }
  }
}

// Create and export the route tree

interface LocaleAppRouteChildren {
  LocaleAppFaqRoute: typeof LocaleAppFaqRoute
  LocaleAppPrivacyPolicyRoute: typeof LocaleAppPrivacyPolicyRoute
  LocaleAppSavedRoute: typeof LocaleAppSavedRoute
  LocaleAppTermsRoute: typeof LocaleAppTermsRoute
  LocaleAppIndexRoute: typeof LocaleAppIndexRoute
  LocaleAppResourcesIdRoute: typeof LocaleAppResourcesIdRoute
}

const LocaleAppRouteChildren: LocaleAppRouteChildren = {
  LocaleAppFaqRoute: LocaleAppFaqRoute,
  LocaleAppPrivacyPolicyRoute: LocaleAppPrivacyPolicyRoute,
  LocaleAppSavedRoute: LocaleAppSavedRoute,
  LocaleAppTermsRoute: LocaleAppTermsRoute,
  LocaleAppIndexRoute: LocaleAppIndexRoute,
  LocaleAppResourcesIdRoute: LocaleAppResourcesIdRoute,
}

const LocaleAppRouteWithChildren = LocaleAppRoute._addFileChildren(
  LocaleAppRouteChildren,
)

interface LocaleAdminAdminRouteChildren {
  LocaleAdminAdminAnalyticsRoute: typeof LocaleAdminAdminAnalyticsRoute
  LocaleAdminAdminIndexRoute: typeof LocaleAdminAdminIndexRoute
  LocaleAdminAdminListingsIdRoute: typeof LocaleAdminAdminListingsIdRoute
  LocaleAdminAdminListingsListRoute: typeof LocaleAdminAdminListingsListRoute
  LocaleAdminAdminListingsNewRoute: typeof LocaleAdminAdminListingsNewRoute
  LocaleAdminAdminProvidersIdRoute: typeof LocaleAdminAdminProvidersIdRoute
  LocaleAdminAdminProvidersListRoute: typeof LocaleAdminAdminProvidersListRoute
  LocaleAdminAdminProvidersMeRoute: typeof LocaleAdminAdminProvidersMeRoute
}

const LocaleAdminAdminRouteChildren: LocaleAdminAdminRouteChildren = {
  LocaleAdminAdminAnalyticsRoute: LocaleAdminAdminAnalyticsRoute,
  LocaleAdminAdminIndexRoute: LocaleAdminAdminIndexRoute,
  LocaleAdminAdminListingsIdRoute: LocaleAdminAdminListingsIdRoute,
  LocaleAdminAdminListingsListRoute: LocaleAdminAdminListingsListRoute,
  LocaleAdminAdminListingsNewRoute: LocaleAdminAdminListingsNewRoute,
  LocaleAdminAdminProvidersIdRoute: LocaleAdminAdminProvidersIdRoute,
  LocaleAdminAdminProvidersListRoute: LocaleAdminAdminProvidersListRoute,
  LocaleAdminAdminProvidersMeRoute: LocaleAdminAdminProvidersMeRoute,
}

const LocaleAdminAdminRouteWithChildren =
  LocaleAdminAdminRoute._addFileChildren(LocaleAdminAdminRouteChildren)

interface LocaleAdminRouteChildren {
  LocaleAdminAdminRoute: typeof LocaleAdminAdminRouteWithChildren
  LocaleAdminLoginRoute: typeof LocaleAdminLoginRoute
  LocaleAdminOnboardingRoute: typeof LocaleAdminOnboardingRoute
  LocaleAdminResetPasswordRoute: typeof LocaleAdminResetPasswordRoute
  LocaleAdminSignupRoute: typeof LocaleAdminSignupRoute
  LocaleAdminVerifyEmailRoute: typeof LocaleAdminVerifyEmailRoute
}

const LocaleAdminRouteChildren: LocaleAdminRouteChildren = {
  LocaleAdminAdminRoute: LocaleAdminAdminRouteWithChildren,
  LocaleAdminLoginRoute: LocaleAdminLoginRoute,
  LocaleAdminOnboardingRoute: LocaleAdminOnboardingRoute,
  LocaleAdminResetPasswordRoute: LocaleAdminResetPasswordRoute,
  LocaleAdminSignupRoute: LocaleAdminSignupRoute,
  LocaleAdminVerifyEmailRoute: LocaleAdminVerifyEmailRoute,
}

const LocaleAdminRouteWithChildren = LocaleAdminRoute._addFileChildren(
  LocaleAdminRouteChildren,
)

interface LocaleRouteChildren {
  LocaleAppRoute: typeof LocaleAppRouteWithChildren
  LocaleAdminRoute: typeof LocaleAdminRouteWithChildren
}

const LocaleRouteChildren: LocaleRouteChildren = {
  LocaleAppRoute: LocaleAppRouteWithChildren,
  LocaleAdminRoute: LocaleAdminRouteWithChildren,
}

const LocaleRouteWithChildren =
  LocaleRoute._addFileChildren(LocaleRouteChildren)

export interface FileRoutesByFullPath {
  '/$locale': typeof LocaleAppRouteWithChildren
  '/$locale/admin': typeof LocaleAdminAdminRouteWithChildren
  '/$locale/faq': typeof LocaleAppFaqRoute
  '/$locale/privacy-policy': typeof LocaleAppPrivacyPolicyRoute
  '/$locale/saved': typeof LocaleAppSavedRoute
  '/$locale/terms': typeof LocaleAppTermsRoute
  '/$locale/admin/login': typeof LocaleAdminLoginRoute
  '/$locale/admin/onboarding': typeof LocaleAdminOnboardingRoute
  '/$locale/admin/reset-password': typeof LocaleAdminResetPasswordRoute
  '/$locale/admin/signup': typeof LocaleAdminSignupRoute
  '/$locale/admin/verify-email': typeof LocaleAdminVerifyEmailRoute
  '/$locale/': typeof LocaleAppIndexRoute
  '/$locale/resources/$id': typeof LocaleAppResourcesIdRoute
  '/$locale/admin/analytics': typeof LocaleAdminAdminAnalyticsRoute
  '/$locale/admin/': typeof LocaleAdminAdminIndexRoute
  '/$locale/admin/listings/$id': typeof LocaleAdminAdminListingsIdRoute
  '/$locale/admin/listings/list': typeof LocaleAdminAdminListingsListRoute
  '/$locale/admin/listings/new': typeof LocaleAdminAdminListingsNewRoute
  '/$locale/admin/providers/$id': typeof LocaleAdminAdminProvidersIdRoute
  '/$locale/admin/providers/list': typeof LocaleAdminAdminProvidersListRoute
  '/$locale/admin/providers/me': typeof LocaleAdminAdminProvidersMeRoute
}

export interface FileRoutesByTo {
  '/$locale': typeof LocaleAppIndexRoute
  '/$locale/admin': typeof LocaleAdminAdminIndexRoute
  '/$locale/faq': typeof LocaleAppFaqRoute
  '/$locale/privacy-policy': typeof LocaleAppPrivacyPolicyRoute
  '/$locale/saved': typeof LocaleAppSavedRoute
  '/$locale/terms': typeof LocaleAppTermsRoute
  '/$locale/admin/login': typeof LocaleAdminLoginRoute
  '/$locale/admin/onboarding': typeof LocaleAdminOnboardingRoute
  '/$locale/admin/reset-password': typeof LocaleAdminResetPasswordRoute
  '/$locale/admin/signup': typeof LocaleAdminSignupRoute
  '/$locale/admin/verify-email': typeof LocaleAdminVerifyEmailRoute
  '/$locale/resources/$id': typeof LocaleAppResourcesIdRoute
  '/$locale/admin/analytics': typeof LocaleAdminAdminAnalyticsRoute
  '/$locale/admin/listings/$id': typeof LocaleAdminAdminListingsIdRoute
  '/$locale/admin/listings/list': typeof LocaleAdminAdminListingsListRoute
  '/$locale/admin/listings/new': typeof LocaleAdminAdminListingsNewRoute
  '/$locale/admin/providers/$id': typeof LocaleAdminAdminProvidersIdRoute
  '/$locale/admin/providers/list': typeof LocaleAdminAdminProvidersListRoute
  '/$locale/admin/providers/me': typeof LocaleAdminAdminProvidersMeRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/$locale': typeof LocaleRouteWithChildren
  '/$locale/_app': typeof LocaleAppRouteWithChildren
  '/$locale/admin': typeof LocaleAdminRouteWithChildren
  '/$locale/_app/faq': typeof LocaleAppFaqRoute
  '/$locale/_app/privacy-policy': typeof LocaleAppPrivacyPolicyRoute
  '/$locale/_app/saved': typeof LocaleAppSavedRoute
  '/$locale/_app/terms': typeof LocaleAppTermsRoute
  '/$locale/admin/_admin': typeof LocaleAdminAdminRouteWithChildren
  '/$locale/admin/login': typeof LocaleAdminLoginRoute
  '/$locale/admin/onboarding': typeof LocaleAdminOnboardingRoute
  '/$locale/admin/reset-password': typeof LocaleAdminResetPasswordRoute
  '/$locale/admin/signup': typeof LocaleAdminSignupRoute
  '/$locale/admin/verify-email': typeof LocaleAdminVerifyEmailRoute
  '/$locale/_app/': typeof LocaleAppIndexRoute
  '/$locale/_app/resources/$id': typeof LocaleAppResourcesIdRoute
  '/$locale/admin/_admin/analytics': typeof LocaleAdminAdminAnalyticsRoute
  '/$locale/admin/_admin/': typeof LocaleAdminAdminIndexRoute
  '/$locale/admin/_admin/listings/$id': typeof LocaleAdminAdminListingsIdRoute
  '/$locale/admin/_admin/listings/list': typeof LocaleAdminAdminListingsListRoute
  '/$locale/admin/_admin/listings/new': typeof LocaleAdminAdminListingsNewRoute
  '/$locale/admin/_admin/providers/$id': typeof LocaleAdminAdminProvidersIdRoute
  '/$locale/admin/_admin/providers/list': typeof LocaleAdminAdminProvidersListRoute
  '/$locale/admin/_admin/providers/me': typeof LocaleAdminAdminProvidersMeRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/$locale'
    | '/$locale/admin'
    | '/$locale/faq'
    | '/$locale/privacy-policy'
    | '/$locale/saved'
    | '/$locale/terms'
    | '/$locale/admin/login'
    | '/$locale/admin/onboarding'
    | '/$locale/admin/reset-password'
    | '/$locale/admin/signup'
    | '/$locale/admin/verify-email'
    | '/$locale/'
    | '/$locale/resources/$id'
    | '/$locale/admin/analytics'
    | '/$locale/admin/'
    | '/$locale/admin/listings/$id'
    | '/$locale/admin/listings/list'
    | '/$locale/admin/listings/new'
    | '/$locale/admin/providers/$id'
    | '/$locale/admin/providers/list'
    | '/$locale/admin/providers/me'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/$locale'
    | '/$locale/admin'
    | '/$locale/faq'
    | '/$locale/privacy-policy'
    | '/$locale/saved'
    | '/$locale/terms'
    | '/$locale/admin/login'
    | '/$locale/admin/onboarding'
    | '/$locale/admin/reset-password'
    | '/$locale/admin/signup'
    | '/$locale/admin/verify-email'
    | '/$locale/resources/$id'
    | '/$locale/admin/analytics'
    | '/$locale/admin/listings/$id'
    | '/$locale/admin/listings/list'
    | '/$locale/admin/listings/new'
    | '/$locale/admin/providers/$id'
    | '/$locale/admin/providers/list'
    | '/$locale/admin/providers/me'
  id:
    | '__root__'
    | '/$locale'
    | '/$locale/_app'
    | '/$locale/admin'
    | '/$locale/_app/faq'
    | '/$locale/_app/privacy-policy'
    | '/$locale/_app/saved'
    | '/$locale/_app/terms'
    | '/$locale/admin/_admin'
    | '/$locale/admin/login'
    | '/$locale/admin/onboarding'
    | '/$locale/admin/reset-password'
    | '/$locale/admin/signup'
    | '/$locale/admin/verify-email'
    | '/$locale/_app/'
    | '/$locale/_app/resources/$id'
    | '/$locale/admin/_admin/analytics'
    | '/$locale/admin/_admin/'
    | '/$locale/admin/_admin/listings/$id'
    | '/$locale/admin/_admin/listings/list'
    | '/$locale/admin/_admin/listings/new'
    | '/$locale/admin/_admin/providers/$id'
    | '/$locale/admin/_admin/providers/list'
    | '/$locale/admin/_admin/providers/me'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  LocaleRoute: typeof LocaleRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  LocaleRoute: LocaleRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/$locale"
      ]
    },
    "/$locale": {
      "filePath": "$locale",
      "children": [
        "/$locale/_app",
        "/$locale/admin"
      ]
    },
    "/$locale/_app": {
      "filePath": "$locale/_app.tsx",
      "parent": "/$locale",
      "children": [
        "/$locale/_app/faq",
        "/$locale/_app/privacy-policy",
        "/$locale/_app/saved",
        "/$locale/_app/terms",
        "/$locale/_app/",
        "/$locale/_app/resources/$id"
      ]
    },
    "/$locale/admin": {
      "filePath": "$locale/admin.tsx",
      "parent": "/$locale",
      "children": [
        "/$locale/admin/_admin",
        "/$locale/admin/login",
        "/$locale/admin/onboarding",
        "/$locale/admin/reset-password",
        "/$locale/admin/signup",
        "/$locale/admin/verify-email"
      ]
    },
    "/$locale/_app/faq": {
      "filePath": "$locale/_app/faq.tsx",
      "parent": "/$locale/_app"
    },
    "/$locale/_app/privacy-policy": {
      "filePath": "$locale/_app/privacy-policy.tsx",
      "parent": "/$locale/_app"
    },
    "/$locale/_app/saved": {
      "filePath": "$locale/_app/saved.tsx",
      "parent": "/$locale/_app"
    },
    "/$locale/_app/terms": {
      "filePath": "$locale/_app/terms.tsx",
      "parent": "/$locale/_app"
    },
    "/$locale/admin/_admin": {
      "filePath": "$locale/admin/_admin.tsx",
      "parent": "/$locale/admin",
      "children": [
        "/$locale/admin/_admin/analytics",
        "/$locale/admin/_admin/",
        "/$locale/admin/_admin/listings/$id",
        "/$locale/admin/_admin/listings/list",
        "/$locale/admin/_admin/listings/new",
        "/$locale/admin/_admin/providers/$id",
        "/$locale/admin/_admin/providers/list",
        "/$locale/admin/_admin/providers/me"
      ]
    },
    "/$locale/admin/login": {
      "filePath": "$locale/admin/login.tsx",
      "parent": "/$locale/admin"
    },
    "/$locale/admin/onboarding": {
      "filePath": "$locale/admin/onboarding.tsx",
      "parent": "/$locale/admin"
    },
    "/$locale/admin/reset-password": {
      "filePath": "$locale/admin/reset-password.tsx",
      "parent": "/$locale/admin"
    },
    "/$locale/admin/signup": {
      "filePath": "$locale/admin/signup.tsx",
      "parent": "/$locale/admin"
    },
    "/$locale/admin/verify-email": {
      "filePath": "$locale/admin/verify-email.tsx",
      "parent": "/$locale/admin"
    },
    "/$locale/_app/": {
      "filePath": "$locale/_app/index.tsx",
      "parent": "/$locale/_app"
    },
    "/$locale/_app/resources/$id": {
      "filePath": "$locale/_app/resources/$id.tsx",
      "parent": "/$locale/_app"
    },
    "/$locale/admin/_admin/analytics": {
      "filePath": "$locale/admin/_admin/analytics.tsx",
      "parent": "/$locale/admin/_admin"
    },
    "/$locale/admin/_admin/": {
      "filePath": "$locale/admin/_admin/index.tsx",
      "parent": "/$locale/admin/_admin"
    },
    "/$locale/admin/_admin/listings/$id": {
      "filePath": "$locale/admin/_admin/listings/$id.tsx",
      "parent": "/$locale/admin/_admin"
    },
    "/$locale/admin/_admin/listings/list": {
      "filePath": "$locale/admin/_admin/listings/list.tsx",
      "parent": "/$locale/admin/_admin"
    },
    "/$locale/admin/_admin/listings/new": {
      "filePath": "$locale/admin/_admin/listings/new.tsx",
      "parent": "/$locale/admin/_admin"
    },
    "/$locale/admin/_admin/providers/$id": {
      "filePath": "$locale/admin/_admin/providers/$id.tsx",
      "parent": "/$locale/admin/_admin"
    },
    "/$locale/admin/_admin/providers/list": {
      "filePath": "$locale/admin/_admin/providers/list.tsx",
      "parent": "/$locale/admin/_admin"
    },
    "/$locale/admin/_admin/providers/me": {
      "filePath": "$locale/admin/_admin/providers/me.tsx",
      "parent": "/$locale/admin/_admin"
    }
  }
}
ROUTE_MANIFEST_END */
