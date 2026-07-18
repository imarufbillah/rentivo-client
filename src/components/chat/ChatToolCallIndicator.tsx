"use client";

const toolLabels: Record<string, string> = {
  searchProperties: "Searching properties",
  getPropertyDetails: "Getting property details",
  getUserSavedProperties: "Loading saved properties",
};

interface ChatToolCallIndicatorProps {
  toolName: string;
}

export const ChatToolCallIndicator = ({ toolName }: ChatToolCallIndicatorProps) => (
  <div className="flex items-center gap-2 text-xs text-muted-foreground">
    <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
    <span>{toolLabels[toolName] || toolName}...</span>
  </div>
);
