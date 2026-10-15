import { google } from "@ai-sdk/google";
import { db } from "@crm/db";
import { DEFAULT_AGENT_MODEL, readAgentModel } from "@crm/db/settings";
import { defineDynamic } from "eve";

export interface ModelSelection {
	model: string;
	modelContextWindowTokens: number;
}

export function resolveAgentModel() {
	if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
		return google("gemini-flash-lite-latest") as any;
	}

	return defineDynamic({
		fallback: DEFAULT_AGENT_MODEL.id,
		events: { "session.started": () => selectedModel() },
	});
}

export async function selectedModel(): Promise<ModelSelection | null> {
	try {
		const setting = await readAgentModel(db);

		if (setting.isDefault) return null;

		return {
			model: setting.id,
			modelContextWindowTokens: setting.contextWindowTokens,
		};
	} catch (error) {
		console.error(
			`[agent] could not read the configured model, falling back: ${
				error instanceof Error ? error.message : String(error)
			}`,
		);
		return null;
	}
}
