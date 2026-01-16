"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { memo } from "react";
import type { ChatMessage } from "@/lib/types";
import { Suggestion } from "./elements/suggestion";
import type { VisibilityType } from "./visibility-selector";

type SuggestedActionsProps = {
  chatId: string;
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
  selectedVisibilityType: VisibilityType;
  suggestions?: string[] | null;
};

function PureSuggestedActions({
  chatId,
  sendMessage,
  suggestions,
}: SuggestedActionsProps) {
  // Ensure suggestions is always an array
  const suggestedActions = (() => {
    // If suggestions is null/undefined, return empty array
    if (!suggestions) {
      return [];
    }
    // If suggestions is already an array, use it
    if (Array.isArray(suggestions)) {
      return suggestions;
    }
    // If suggestions is a string (JSON), try to parse it
    if (typeof suggestions === "string") {
      try {
        const parsed = JSON.parse(suggestions);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    // Fallback to empty array for any other type
    return [];
  })();

  // Don't render if there are no suggestions
  if (suggestedActions.length === 0) {
    return null;
  }

  return (
    <div
      className="grid w-full gap-2 sm:grid-cols-2"
      data-testid="suggested-actions"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          initial={{ opacity: 0, y: 20 }}
          key={suggestedAction}
          transition={{ delay: 0.05 * index }}
        >
          <Suggestion
            className="h-auto w-full whitespace-normal p-3 text-left"
            onClick={(suggestion) => {
              // Check if we're in React Admin context
              const isInAdminContext = typeof window !== "undefined" && 
                (window.location.pathname === "/" || window.location.hash.startsWith("#/"));
              
              if (isInAdminContext) {
                window.history.pushState({}, "", `/#/chat/${chatId}`);
              } else {
                // If not in admin, redirect to admin
                window.location.href = `/#/chat/${chatId}`;
                return; // Exit early since we're redirecting
              }
              sendMessage({
                role: "user",
                parts: [{ type: "text", text: suggestion }],
              });
            }}
            suggestion={suggestedAction}
          >
            {suggestedAction}
          </Suggestion>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(
  PureSuggestedActions,
  (prevProps, nextProps) => {
    if (prevProps.chatId !== nextProps.chatId) {
      return false;
    }
    if (prevProps.selectedVisibilityType !== nextProps.selectedVisibilityType) {
      return false;
    }
    if (
      JSON.stringify(prevProps.suggestions) !==
      JSON.stringify(nextProps.suggestions)
    ) {
      return false;
    }

    return true;
  }
);
