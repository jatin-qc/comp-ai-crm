import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AgentBuilderChat } from "@/components/agent-builder/agent-builder-chat";
import { AgentBuilderChatFallback } from "@/components/agent-builder/agent-builder-route-fallback";
import { requireSession } from "@/lib/session";
import { HydrateClient } from "@/lib/trpc/hydrate";
import { getServerQueryClient, getServerTrpc } from "@/lib/trpc/server";

export const metadata: Metadata = { title: "Chat" };

type Props = {
	params: Promise<{
		slug: string;
		id: string;
	}>;
};

export default function ChatConversationPage({ params }: Props) {
	return (
		<Suspense fallback={<AgentBuilderChatFallback />}>
			<ChatConversation params={params} />
		</Suspense>
	);
}

async function ChatConversation({ params }: Props) {
	const { id } = await params;
	await requireSession();

	const trpc = getServerTrpc();
	const queryClient = getServerQueryClient();

	const initialData = await queryClient
		.fetchQuery(trpc.conversations.builderById.queryOptions({ id }))
		.catch(() => null);

	if (!initialData) {
		notFound();
	}

	return (
		<HydrateClient>
			<AgentBuilderChat conversationId={id} initialData={initialData} />
		</HydrateClient>
	);
}
