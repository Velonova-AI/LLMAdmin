'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ChatRequestOptions, CreateMessage, Message } from 'ai';
import { memo } from 'react';
import {useAssistantStore} from "@/app/dashboard/store";
import {Assistant} from "@/lib/db/schema";

interface SuggestedActionsProps {
  chatId: string;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
}


const createSuggestedActions = (prompts: string[]) => {
  return prompts.map(prompt => {
    // Split the prompt into words
    const parts = prompt.split(' ');

    // Form title and label based on the number of words
    let title;
    let label;

    if (parts.length > 4) {
      title = parts.slice(0, 4).join(' ');
      label = prompt.replace(title + ' ', '');
    } else {
      title = prompt;
      label = '';
    }

    return {
      title: title,
      label: label,
      action: prompt
    };
  });
};

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  const { assistant  } = useAssistantStore();

  let prompts: string[] = [];

  if (assistant) {
    prompts = (assistant as Assistant).suggestions as unknown as string[];
  }

    const suggestedActions = createSuggestedActions(prompts);

  return (
    <div className="grid sm:grid-cols-2 gap-2 w-full">
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block'}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, '', `/chat/${chatId}`);

              append({
                role: 'user',
                content: suggestedAction.action,
              });
            }}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
