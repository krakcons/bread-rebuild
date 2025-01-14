import { queryOptions } from "@tanstack/react-query";

import type { Locale } from "@/lib/locale";
import { getI18n } from "@/lib/locale/actions";

export const i18nQueryOptions = (locale: Locale) =>
	queryOptions({
		queryKey: ["i18n", { locale }],
		queryFn: () => getI18n({ data: locale }),
	});
