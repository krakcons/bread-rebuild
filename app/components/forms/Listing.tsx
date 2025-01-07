import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { FieldError } from "@/components/ui/FieldError";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import { Textarea } from "@/components/ui/TextArea";
import {
	days,
	DaySchedule,
	formatScheduleToString,
	parseSchedule,
} from "@/lib/hours";
import { useTranslations } from "@/lib/locale";
import { ListingFormSchema } from "@/server/actions/listings";
import {
	DietaryOptionType,
	ProviderPhoneNumberType,
	ResourceType,
} from "@/server/db/types";
import { OfferingEnum } from "@/server/types";
import { Libraries, useJsApiLoader } from "@react-google-maps/api";
import { useForm, useStore } from "@tanstack/react-form";
import { useParams } from "@tanstack/react-router";
import { Loader2, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";

import { formatAddress } from "@/lib/address";
import { formatPhoneNumber } from "@/lib/phone";
import { Checkbox } from "../ui/Checkbox";
import { BlockNavigation } from "./BlockNavigation";

const checkboxOptions = [
	"free",
	"preparation",
	"transit",
	"wheelchair",
	"parking",
];

const HourSelect = ({
	onChange,
	value,
}: {
	onChange: (value: string) => void;
	value: string | undefined;
}) => {
	return (
		<Select onValueChange={onChange} value={value}>
			<SelectTrigger className="w-[100px]">
				<SelectValue placeholder="" />
			</SelectTrigger>
			<SelectContent>
				{Array.from({ length: 48 }, (_, i) => i).map((segment) => {
					const hour = Math.floor(segment / 2);
					const minute = (segment * 30) % 60;
					const value = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
					return (
						<SelectItem key={value} value={value.replace(":", "")}>
							{value}
						</SelectItem>
					);
				})}
			</SelectContent>
		</Select>
	);
};

const defaultHours = () =>
	parseSchedule(
		"Mon 0900-1700; Tue 0900-1700; Wed 0900-1700; Thu 0900-1700; Fri 0900-1700; Sat 0900-1700; Sun 0900-1700",
	);

const HoursInput = ({
	onChange,
	value,
}: {
	onChange: (value: string) => void;
	value: string;
}) => {
	const { locale } = useParams({
		from: "/$locale",
	});
	const t = useTranslations(locale);

	const hours = useMemo(() => {
		const baseHours = defaultHours();
		const customHours = parseSchedule(value).map((h) => ({
			...h,
			enabled: true,
		}));
		return baseHours.map(
			(h) =>
				customHours.find((c) => c.day === h.day) ?? {
					...h,
					enabled: false,
				},
		);
	}, [value, locale]);

	const handleChange = (newHours: (DaySchedule & { enabled: boolean })[]) => {
		onChange(formatScheduleToString(newHours.filter((h) => h.enabled)));
	};

	return (
		<div className="flex w-full max-w-[600px] flex-col gap-4">
			{days.map((day) => (
				<div key={day} className="flex justify-between gap-4">
					<div className="flex items-center gap-2">
						<Checkbox
							checked={
								hours.find((h) => h.day === day)?.enabled ??
								false
							}
							onCheckedChange={(checked: boolean) => {
								handleChange(
									hours.map((h) =>
										h.day === day
											? { ...h, enabled: checked }
											: h,
									),
								);
							}}
						/>
						<p className="w-[40px]">{day}</p>
					</div>
					<div className="flex items-center gap-2">
						<p>{t.form.listing.hours.startTime}</p>
						<HourSelect
							onChange={(value) =>
								handleChange(
									hours.map((h) =>
										h.day === day
											? { ...h, open: value }
											: h,
									),
								)
							}
							value={
								hours.find((h) => h.day === day)?.open ?? "0900"
							}
						/>
					</div>
					<div className="flex items-center gap-2">
						<p>{t.form.listing.hours.endTime}</p>
						<HourSelect
							onChange={(value) =>
								handleChange(
									hours.map((h) =>
										h.day === day
											? { ...h, close: value }
											: h,
									),
								)
							}
							value={
								hours.find((h) => h.day === day)?.close ??
								"1700"
							}
						/>
					</div>
				</div>
			))}
		</div>
	);
};

const libraries: Libraries = ["places"];

export const ListingForm = ({
	locale,
	defaultValues,
	onSubmit,
	dietaryOptions,
	blockNavigation = true,
}: {
	locale: string;
	defaultValues?: ResourceType;
	onSubmit: (data: z.infer<typeof ListingFormSchema>) => void;
	dietaryOptions: DietaryOptionType[];
	blockNavigation?: boolean;
}) => {
	const t = useTranslations(locale);
	const form = useForm({
		defaultValues: {
			name: defaultValues?.name ?? undefined,
			description: defaultValues?.description ?? undefined,
			email: defaultValues?.email ?? undefined,
			website: defaultValues?.website ?? undefined,
			phoneNumbers:
				defaultValues?.phoneNumbers.map((phone) => ({
					...phone,
					phone: formatPhoneNumber(phone.phone),
				})) ?? undefined,
			offering: defaultValues?.offering ?? "meal",
			eligibility: defaultValues?.eligibility ?? undefined,
			free: defaultValues?.free ?? false,
			preparation: defaultValues?.preparation ?? false,
			transit: defaultValues?.transit ?? false,
			wheelchair: defaultValues?.wheelchair ?? false,
			parking: defaultValues?.parking ?? false,
			hours: defaultValues?.hours ?? undefined,
			fees: defaultValues?.fees ?? undefined,
			parkingNotes: defaultValues?.parkingNotes ?? undefined,
			transitNotes: defaultValues?.transitNotes ?? undefined,
			preparationNotes: defaultValues?.preparationNotes ?? undefined,
			registrationNotes: defaultValues?.registrationNotes ?? undefined,
			wheelchairNotes: defaultValues?.wheelchairNotes ?? undefined,
			capacityNotes: defaultValues?.capacityNotes ?? undefined,
			lat: defaultValues?.lat ?? 0,
			lng: defaultValues?.lng ?? 0,
			city: defaultValues?.city ?? "",
			street1: defaultValues?.street1 ?? "",
			street2: defaultValues?.street2 ?? "",
			postalCode: defaultValues?.postalCode ?? "",
			province: defaultValues?.province ?? "",
			country: defaultValues?.country ?? "",
			dietaryOptions:
				defaultValues?.dietaryOptions?.map((option) => option.id) ??
				undefined,
		},
		validators: {
			onSubmit: ListingFormSchema,
		},
		onSubmit: async ({ value: data, formApi }) => {
			console.log(data);
			try {
				await onSubmit(data);
			} catch (error) {
				formApi.setErrorMap({
					onServer: "Something went wrong",
				});
			}
		},
	});

	// GOOGLE MAPS
	const [location, setLocation] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	const { isLoaded, loadError } = useJsApiLoader({
		id: "google-map-script",
		version: "weekly",
		language: "en",
		libraries,
		googleMapsApiKey: "AIzaSyBd8fQknyAuGoA6lsCj0OEFkd7LxIU45Tc",
	});

	const handlePlaceChanged = (
		autocomplete: google.maps.places.Autocomplete,
	) => {
		setLocation("");
		const place = autocomplete.getPlace();
		const findByType = (type: string) =>
			place.address_components?.find((c) => c.types.includes(type))
				?.long_name;

		const street =
			findByType("street_number") &&
			findByType("route") &&
			findByType("street_number") + " " + findByType("route");
		const city = findByType("locality");
		const province = findByType("administrative_area_level_1");
		const country = findByType("country");
		const postalCode = findByType("postal_code");

		form.setFieldValue("lat", place.geometry?.location?.lat() ?? 0);
		form.setFieldValue("lng", place.geometry?.location?.lng() ?? 0);
		form.setFieldValue("street1", street ?? "");
		form.setFieldValue("postalCode", postalCode ?? "");
		form.setFieldValue("city", city ?? "");
		form.setFieldValue("province", province ?? "");
		form.setFieldValue("country", country ?? "");

		// Revalidate immediately
		form.validateField("lat", "submit");
		form.validateField("lng", "submit");
		form.validateField("city", "submit");
		form.validateField("street1", "submit");
		form.validateField("postalCode", "submit");
		form.validateField("province", "submit");
		form.validateField("country", "submit");
	};

	useEffect(() => {
		if (!isLoaded || loadError || !inputRef.current) return;

		const autocomplete = new google.maps.places.Autocomplete(
			inputRef.current,
			{
				componentRestrictions: { country: "ca" },
				fields: ["address_components", "geometry"],
			},
		);
		autocomplete.addListener("place_changed", () =>
			handlePlaceChanged(autocomplete),
		);
	}, [isLoaded, loadError]);

	const serverError = useStore(
		form.store,
		(formState) => formState.errorMap.onServer,
	);

	const isDirty = useStore(form.store, (formState) => formState.isDirty);
	const isSubmitting = useStore(
		form.store,
		(formState) => formState.isSubmitting,
	);
	const isSubmitted = useStore(
		form.store,
		(formState) => formState.isSubmitted,
	);

	return (
		<>
			<BlockNavigation
				shouldBlockFn={() =>
					blockNavigation && isDirty && !(isSubmitting || isSubmitted)
				}
			/>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<div className="flex flex-col gap-4">
					{serverError && (
						<ErrorMessage text={serverError as string} />
					)}
					<form.Field
						name="offering"
						children={(field) => (
							<Label>
								{t.form.listing.offering.title}
								<Select
									value={field.state.value}
									onValueChange={(value) =>
										field.handleChange(
											value as OfferingEnum,
										)
									}
								>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="" />
									</SelectTrigger>
									<SelectContent>
										{Object.keys(t.offeringTypes).map(
											(key) => (
												<SelectItem
													value={key}
													key={key}
												>
													{t.offeringTypes[key]}
												</SelectItem>
											),
										)}
									</SelectContent>
								</Select>
							</Label>
						)}
					/>
					<form.Field
						name="name"
						children={(field) => (
							<Label>
								<span className="flex items-center gap-1">
									{t.common.name}
									<span className="text-xs text-muted-foreground">
										({t.common.optional})
									</span>
								</span>
								<Input
									name={field.name}
									value={field.state.value ?? ""}
									onBlur={field.handleBlur}
									onChange={(e) =>
										field.handleChange(e.target.value)
									}
								/>
								{defaultValues?.provider.name && (
									<p className="text-xs text-muted-foreground">
										{`${t.form.listing.fallback} ${defaultValues?.provider.name}`}
									</p>
								)}
								<FieldError state={field.state} />
							</Label>
						)}
					/>
					<form.Field
						name="description"
						children={(field) => (
							<Label>
								<span className="flex items-center gap-1">
									{t.form.common.description}
									<span className="text-xs text-muted-foreground">
										({t.common.optional})
									</span>
								</span>
								<Textarea
									name={field.name}
									value={field.state.value ?? ""}
									onBlur={field.handleBlur}
									onChange={(e) =>
										field.handleChange(e.target.value)
									}
								/>
								<FieldError state={field.state} />
							</Label>
						)}
					/>
					<form.Field
						name="eligibility"
						children={(field) => (
							<Label>
								<span className="flex items-center gap-1">
									{t.form.listing.eligibility.title}
									<span className="text-xs text-muted-foreground">
										({t.common.optional})
									</span>
								</span>
								<Textarea
									name={field.name}
									value={field.state.value ?? ""}
									onBlur={field.handleBlur}
									onChange={(e) =>
										field.handleChange(e.target.value)
									}
								/>
								<p className="text-xs text-muted-foreground">
									{"Ex: " +
										t.form.listing.eligibility.example}
								</p>
								<FieldError state={field.state} />
							</Label>
						)}
					/>
					<div className="flex flex-col gap-2 border-t border-border pt-4">
						<p className="font-medium">
							{t.form.listing.location.title}
						</p>
						<p className="text-sm text-muted-foreground">
							{t.form.listing.location.description}
						</p>
					</div>
					<Input
						ref={inputRef}
						onChange={(e) => setLocation(e.target.value)}
						value={location}
						placeholder={t.form.listing.location.placeholder}
					/>
					<form.Subscribe
						selector={(formState) => [
							formState.values.city,
							formState.values.street1,
							formState.values.postalCode,
							formState.values.province,
						]}
					>
						{([city, street1, postalCode, province]) =>
							city && (
								<div className="flex flex-col gap-4">
									<table>
										<thead>
											<tr className="text-sm font-medium">
												{street1 && (
													<th className="text-left">
														{
															t.form.listing
																.location.street
														}
													</th>
												)}
												{city && (
													<th className="text-left">
														{
															t.form.listing
																.location.city
														}
													</th>
												)}
												{province && (
													<th className="text-left">
														{
															t.form.listing
																.location
																.province
														}
													</th>
												)}
												{postalCode && (
													<th className="text-left">
														{
															t.form.listing
																.location
																.postalCode
														}
													</th>
												)}
											</tr>
										</thead>
										<tbody>
											<tr className="text-sm">
												{street1 && <td>{street1}</td>}
												{city && <td>{city}</td>}
												{province && (
													<td>{province}</td>
												)}
												{postalCode && (
													<td>{postalCode}</td>
												)}
											</tr>
										</tbody>
									</table>
									<div>
										<p className="text-sm font-medium">
											{t.form.listing.location.full}
										</p>
										<p className="text-sm">
											{formatAddress({
												street1,
												city,
												province,
												postalCode,
											})}
										</p>
									</div>
								</div>
							)
						}
					</form.Subscribe>
					<form.Field
						name="lat"
						children={(field) => <FieldError state={field.state} />}
					/>
					<form.Field
						name="lng"
						children={(field) => <FieldError state={field.state} />}
					/>
					<form.Field
						name="city"
						children={(field) => <FieldError state={field.state} />}
					/>
					<form.Field
						name="street1"
						children={(field) => <FieldError state={field.state} />}
					/>
					<form.Field
						name="postalCode"
						children={(field) => <FieldError state={field.state} />}
					/>
					<form.Field
						name="province"
						children={(field) => <FieldError state={field.state} />}
					/>
					<div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
						<p className="font-medium">
							{t.form.listing.toggles.title}
						</p>
						<p className="text-sm text-muted-foreground">
							{t.form.listing.toggles.description}
						</p>
					</div>
					<div className="flex flex-col gap-8">
						{checkboxOptions.map((option) => (
							<div key={option} className="flex flex-col gap-4">
								<div className="flex flex-col gap-4">
									<form.Field
										name={option}
										children={(field) => (
											<Label className="flex flex-row items-center gap-2">
												<Checkbox
													name={field.name}
													checked={
														field.state.value ??
														false
													}
													onBlur={field.handleBlur}
													onCheckedChange={(
														checked: boolean,
													) =>
														field.handleChange(
															checked,
														)
													}
												/>
												<span className="text-sm font-medium">
													{t.form.listing.toggles[
														option as keyof typeof t.form.listing.toggles
													].title + ": "}
													<span className="text-sm text-muted-foreground">
														{
															t.form.listing
																.toggles[
																option as keyof typeof t.form.listing.toggles
															].description
														}
													</span>
												</span>
												<FieldError
													state={field.state}
												/>
											</Label>
										)}
									/>
									<form.Field
										name={
											option === "free"
												? "fees"
												: `${option}Notes`
										}
										children={(field) => (
											<Label>
												<span className="flex items-center gap-1">
													{t.form.listing.notes}
													<span className="text-xs text-muted-foreground">
														({t.common.optional})
													</span>
												</span>
												<Textarea
													name={field.name}
													value={
														field.state.value ?? ""
													}
													onBlur={field.handleBlur}
													onChange={(e) =>
														field.handleChange(
															e.target.value,
														)
													}
												/>
												<p className="text-xs text-muted-foreground">
													{"Ex: " +
														t.form.listing.toggles[
															option as keyof typeof t.form.listing.toggles
														].example}
												</p>
												<FieldError
													state={field.state}
												/>
											</Label>
										)}
									/>
								</div>
							</div>
						))}
					</div>
					<div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
						<p className="font-medium">
							{t.form.listing.dietaryOptions.title}
						</p>
						<p className="text-sm text-muted-foreground">
							{t.form.listing.dietaryOptions.description}
						</p>
					</div>
					<div className="flex flex-col gap-2">
						<form.Field
							name="dietaryOptions"
							children={(field) => (
								<>
									{dietaryOptions.map((option) => (
										<div
											key={option.id}
											className="flex items-center gap-2"
										>
											<Checkbox
												name={option.id}
												checked={field.state.value?.includes(
													option.id,
												)}
												onCheckedChange={(checked) => {
													if (checked) {
														field.handleChange([
															...(field.state
																.value ?? []),
															option.id,
														]);
													} else {
														field.handleChange(
															(
																field.state
																	.value ?? []
															).filter(
																(id) =>
																	id !==
																	option.id,
															),
														);
													}
												}}
											/>
											{option.name}
										</div>
									))}
									<FieldError state={field.state} />
								</>
							)}
						/>
					</div>
					<div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
						<p className="font-medium">
							{t.form.listing.hours.title}
						</p>
						<p className="text-sm text-muted-foreground">
							{t.form.listing.hours.description}
						</p>
					</div>
					<form.Field
						name="hours"
						children={(field) => (
							<>
								<HoursInput
									onChange={(value) => {
										field.handleChange(value);
									}}
									value={field.state.value ?? ""}
								/>
								<FieldError state={field.state} />
							</>
						)}
					/>
					<div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
						<p className="font-medium">
							{t.form.listing.contact.title}
						</p>
						<p className="text-sm text-muted-foreground">
							{t.form.listing.contact.description}
						</p>
					</div>
					<form.Field
						name="email"
						children={(field) => (
							<Label>
								<span className="flex items-center gap-1">
									{t.form.common.email}
									<span className="text-xs text-muted-foreground">
										({t.common.optional})
									</span>
								</span>
								<Input
									name={field.name}
									value={field.state.value ?? ""}
									onBlur={field.handleBlur}
									onChange={(e) =>
										field.handleChange(e.target.value)
									}
								/>
								{defaultValues?.provider.email && (
									<p className="text-xs text-muted-foreground">
										{`${t.form.listing.fallback} ${defaultValues?.provider.email}`}
									</p>
								)}
								<FieldError state={field.state} />
							</Label>
						)}
					/>
					<form.Field
						name="website"
						children={(field) => (
							<Label>
								<span className="flex items-center gap-1">
									{t.form.contact.website}
									<span className="text-xs text-muted-foreground">
										({t.common.optional})
									</span>
								</span>
								<Input
									name={field.name}
									value={field.state.value ?? ""}
									onBlur={field.handleBlur}
									onChange={(e) =>
										field.handleChange(e.target.value)
									}
								/>
								{defaultValues?.provider.website && (
									<p className="text-xs text-muted-foreground">
										{`${t.form.listing.fallback} ${defaultValues?.provider.website}`}
									</p>
								)}
								<FieldError state={field.state} />
							</Label>
						)}
					/>
					<form.Field
						name="phoneNumbers"
						mode="array"
						children={(field) => (
							<Label>
								<span className="flex items-center gap-1">
									{t.form.contact.phoneNumbers}
									<span className="text-xs text-muted-foreground">
										({t.common.optional})
									</span>
								</span>
								{field.state.value?.map((_, i) => (
									<div
										key={`phoneNumbers[${i}]`}
										className="flex gap-2"
									>
										<form.Field
											name={`phoneNumbers[${i}].phone`}
											children={(field) => (
												<div className="flex flex-grow flex-col gap-2">
													<Input
														name={`phoneNumbers[${i}].phone`}
														value={
															field.state.value
														}
														onBlur={
															field.handleBlur
														}
														onChange={(e) =>
															field.handleChange(
																e.target.value,
															)
														}
														autoComplete="tel"
													/>
													<FieldError
														state={field.state}
													/>
												</div>
											)}
										/>
										<form.Field
											name={`phoneNumbers[${i}].type`}
											children={(field) => (
												<div className="flex flex-col gap-2">
													<Select
														value={
															field.state.value
														}
														onValueChange={(
															value,
														) =>
															field.handleChange(
																value as ProviderPhoneNumberType["type"],
															)
														}
													>
														<SelectTrigger className="w-[180px]">
															<SelectValue placeholder="" />
														</SelectTrigger>
														<SelectContent>
															{Object.keys(
																t.phoneTypes,
															).map((type) => (
																<SelectItem
																	value={type}
																	key={type}
																>
																	{
																		t
																			.phoneTypes[
																			type
																		]
																	}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FieldError
														state={field.state}
													/>
												</div>
											)}
										/>
										<Button
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												field.removeValue(i);
											}}
											size="icon"
											className="mb-2"
										>
											<Trash2 size={16} />
										</Button>
									</div>
								))}
								<Button
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										field.pushValue({
											phone: "",
											type: "phone",
										});
									}}
								>
									{t.form.contact.addPhoneNumber}
								</Button>
								{defaultValues?.provider.phoneNumbers &&
									defaultValues?.provider.phoneNumbers
										.length > 0 && (
										<p className="text-xs text-muted-foreground">
											{`${t.form.listing.fallback} ${defaultValues?.provider.phoneNumbers.map((phone) => formatPhoneNumber(phone.phone)).join(", ")}`}
										</p>
									)}
								<FieldError state={field.state} />
							</Label>
						)}
					/>
					<form.Subscribe
						selector={(formState) => [formState.isSubmitting]}
					>
						{([isSubmitting]) => (
							<Button
								type="submit"
								disabled={isSubmitting}
								className="self-start"
							>
								{isSubmitting && (
									<Loader2 className="animate-spin" />
								)}
								{t.common.submit}
							</Button>
						)}
					</form.Subscribe>
				</div>
			</form>
		</>
	);
};
