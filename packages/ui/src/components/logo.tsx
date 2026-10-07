import type * as React from "react";

/**
 * Quess brand mark — the blue "Q". Square viewBox so it drops into the same
 * icon slots the old mark used (`size-*` etc.). The artwork lives at
 * `apps/app/public/brand/quess-mark.png` and is referenced by absolute path.
 */
const Logo = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 681 681"
		fill="none"
		role="img"
		aria-label="Quess"
		{...props}
	>
		<image href="/brand/quess-mark.png" width={681} height={681} />
	</svg>
);
export default Logo;
