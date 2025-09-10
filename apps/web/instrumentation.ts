// Mastra instrumentation setup
// This file is required to disable telemetry warnings

export async function register() {
  // Disable Mastra telemetry warnings
  (globalThis as any).___MASTRA_TELEMETRY___ = true;
}
