import type * as React from "react";
import { cn } from "@crm/ui/lib/utils";

/**
 * Full "QUESS — Winning Together" wordmark, for the spots with room for it
 * (sign-in, app header). Ships a light-text and a dark-text rendering and
 * swaps between them with the `dark` variant; the blue "Q" is constant.
 *
 * Size it by height — e.g. `<BrandWordmark className="h-6" />`.
 * Artwork: `apps/app/public/brand/quess-logo{,-dark}.png`.
 */
export function BrandWordmark({
	className,
	...props
}: React.ComponentPropsWithoutRef<"span">) {
	return (
		<span className={cn("inline-flex h-6 items-center", className)} {...props}>
			<img
				src="/brand/quess-logo.png"
				alt="Quess"
				className="h-full w-auto max-w-none object-contain object-left dark:hidden"
			/>
			<img
				src="/brand/quess-logo-dark.png"
				alt="Quess"
				className="hidden h-full w-auto max-w-none object-contain object-left dark:block"
			/>
		</span>
	);
}

export default BrandWordmark;
