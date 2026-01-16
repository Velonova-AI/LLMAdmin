"use client";

import { Edit } from "@/components/admin/edit";
import { SimpleForm } from "@/components/admin/simple-form";
import { TextInput } from "@/components/admin/text-input";
import { BooleanInput } from "@/components/admin/boolean-input";
import { NumberInput } from "@/components/admin/number-input";
import { SelectInput } from "@/components/admin/select-input";
import { required, useInput, useResourceContext, FieldTitle } from "ra-core";
import { useState } from "react";
import {
  FormControl,
  FormError,
  FormField,
  FormLabel,
} from "@/components/admin/form";
import { Input } from "@/components/ui/input";
import { InputHelperText } from "@/components/admin/input-helper-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import type { InputProps } from "ra-core";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Provider choices list (starting with mistral)
const providerChoices = [
  { id: "mistral", name: "Mistral" },
  // { id: "openai", name: "OpenAI" },
  // { id: "anthropic", name: "Anthropic" },
  // { id: "google", name: "Google" },
  // { id: "xai", name: "xAI" },
];

// Model choices list (starting with pixtral-12b)
const modelChoices = [
  { id: "pixtral-12b", name: "Pixtral-12B" },
  // { id: "mistral-large", name: "Mistral Large" },
  // { id: "mistral-medium", name: "Mistral Medium" },
  // { id: "mistral-small", name: "Mistral Small" },
  // { id: "gpt-4", name: "GPT-4" },
  // { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  // { id: "claude-3-opus", name: "Claude 3 Opus" },
  // { id: "claude-3-sonnet", name: "Claude 3 Sonnet" },
  // { id: "claude-3-haiku", name: "Claude 3 Haiku" },
  // { id: "gemini-pro", name: "Gemini Pro" },
  // { id: "gemini-ultra", name: "Gemini Ultra" },
  // { id: "grok-beta", name: "Grok Beta" },
];

// Custom SuggestionsInput component
const SuggestionsInput = (props: InputProps & { className?: string }) => {
  const resource = useResourceContext(props);
  const {
    label,
    source,
    className,
    helperText,
    validate: _validateProp,
    format: _formatProp,
    ...rest
  } = props;
  const { id, field, isRequired } = useInput(props);
  const [newSuggestion, setNewSuggestion] = useState("");
  
  // Ensure field.value is always an array
  const suggestions: string[] = Array.isArray(field.value) ? field.value : [];

  const handleAddSuggestion = () => {
    if (newSuggestion.trim()) {
      const updated = [...suggestions, newSuggestion.trim()];
      field.onChange(updated);
      setNewSuggestion("");
    }
  };

  const handleDeleteSuggestion = (index: number) => {
    const updated = suggestions.filter((_, i) => i !== index);
    field.onChange(updated);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSuggestion();
    }
  };

  return (
    <FormField id={id} className={className} name={field.name}>
      {label !== false && (
        <FormLabel>
          <FieldTitle
            label={label}
            source={source}
            resource={resource}
            isRequired={isRequired}
          />
        </FormLabel>
      )}
      <FormControl>
        <div className="relative">
          <Input
            {...rest}
            value={newSuggestion}
            onChange={(e) => setNewSuggestion(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a suggestion..."
            className="pr-10"
          />
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={handleAddSuggestion}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </FormControl>
      {suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1 pr-1"
            >
              <span>{suggestion}</span>
              <button
                type="button"
                onClick={() => handleDeleteSuggestion(index)}
                className="ml-1 rounded-full hover:bg-destructive/20 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <InputHelperText helperText={helperText} />
      <FormError />
    </FormField>
  );
};

export const AssistantEdit = () => (
  <Edit>
    <SimpleForm>
      {/* Hidden field for id - not visible but included in form submission */}
      <TextInput source="id" style={{ display: "none" }} />
      
      {/* Required fields */}
      <TextInput source="name" validate={[required()]} />
      <SelectInput source="provider" choices={providerChoices} validate={[required()]} />
      <SelectInput source="model_name" choices={modelChoices} validate={[required()]} />
      
      {/* Optional fields */}
      <TextInput source="system_prompt" multiline rows={4} validate={[required()]} />
      
      <TextInput source="greeting_title" />
      <TextInput source="greeting_subtitle" />
      
      {/* Array fields */}
      <SuggestionsInput 
        source="suggestions" 
        label="Suggestions"
        helperText="Add example queries users can select."
      />

      {/* Advanced Settings */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="advanced-settings">
          <AccordionTrigger>Advanced Settings</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <TextInput source="api_key" />
            <BooleanInput source="active" />
            <TextInput source="temperature" />
            <TextInput source="max_tokens" />
            <NumberInput source="memory_limit" />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </SimpleForm>
  </Edit>
);