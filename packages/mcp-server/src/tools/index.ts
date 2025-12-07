import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export default function registryTools(server: McpServer) {
    [].forEach(registryFn => registryFn(server))
}