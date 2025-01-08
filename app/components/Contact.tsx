export const Contact = ({
	label,
	value,
	icon,
	link,
}: {
	label: string;
	value?: string | React.ReactNode | null;
	link?: string | null;
	icon: React.ReactNode;
}) => {
	if (!value) return null;
	return (
		<div className="flex items-center gap-3">
			<div className="flex min-w-8 items-center justify-center">
				{icon}
			</div>
			<div>
				<p className="mb-1 font-medium">{label}</p>
				{link ? (
					<a
						href={link}
						target="_blank"
						className="text-muted-foreground hover:underline"
					>
						{value || "-"}
					</a>
				) : (
					<p className="text-muted-foreground">{value || "-"}</p>
				)}
			</div>
		</div>
	);
};
