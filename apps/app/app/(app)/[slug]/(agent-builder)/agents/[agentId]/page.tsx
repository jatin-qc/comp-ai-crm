import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { TeamAgentDetail } from "@/components/agent-builder/team-agent-detail";
import { PageShellLoading } from "@/components/page-shell";
import { requireSession } from "@/lib/session";
import { HydrateClient } from "@/lib/trpc/hydrate";
import { getServerQueryClient, getServerTrpc } from "@/lib/trpc/server";

export const metadata: Metadata = { title: "Agent" };

type Props = {
	params: Promise<{
		slug: string;
		agentId: string;
	}>;
};

export default function AgentDetailPage({ params }: Props) {
	return (
		<Suspense fallback={<PageShellLoading />}>
			<AgentDetailContent params={params} />
		</Suspense>
	);
}

async function AgentDetailContent({ params }: Props) {
	const { agentId } = await params;
	await requireSession();

	const trpc = getServerTrpc();
	const queryClient = getServerQueryClient();

	const initialAgent = await queryClient
		.fetchQuery(trpc.agents.byId.queryOptions({ id: agentId }))
		.catch(() => null);

	if (!initialAgent) {
		notFound();
	}

	const [initialRuns, initialActivity] = await Promise.all([
		queryClient
			.fetchQuery(trpc.agents.history.queryOptions({ id: agentId, limit: 20 }))
			.catch(() => []),
		queryClient
			.fetchQuery(trpc.agents.activity.queryOptions({ id: agentId, limit: 20 }))
			.catch(() => []),
	]);

	return (
		<HydrateClient>
			<TeamAgentDetail
				agentId={agentId}
				initialAgent={initialAgent}
				initialRuns={initialRuns}
				initialActivity={initialActivity}
			/>
		</HydrateClient>
	);
}
