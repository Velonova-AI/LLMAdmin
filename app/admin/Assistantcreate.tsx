"use client";

import { Create } from "@/components/admin/create";
import { SimpleForm } from "@/components/admin/simple-form";
import { TextInput } from "@/components/admin/text-input";
import { BooleanInput } from "@/components/admin/boolean-input";
import { NumberInput } from "@/components/admin/number-input";

import { SelectInput } from "@/components/admin/select-input";
import { required, useGetIdentity, useInput, useResourceContext, FieldTitle, useNotify, useRedirect } from "ra-core";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { assistantTemplates, type AssistantTemplate } from "@/lib/assistant-templates";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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

// Inner component to set user_id when identity is available
const SetUserIdField = () => {
  const { data: identity } = useGetIdentity();
  const { setValue } = useFormContext();

  useEffect(() => {
    if (identity?.id) {
      setValue("user_id", identity.id);
    }
  }, [identity, setValue]);

  return null;
};

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
  
  const suggestions: string[] = field.value || [];

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
            size="icon"
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

export const AssistantCreate = () => {
  const { data: identity } = useGetIdentity();
  const notify = useNotify();
  const redirect = useRedirect();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("none");

  const defaultValues = {
    user_id: identity?.id || "",
    provider: "mistral",
    model_name: "pixtral-12b",
    temperature: "0.7",
    max_tokens: "4000",
    memory_limit: 10,
    rag_enabled: false,
    active: true,
    files: [],
    suggestions: [],
    greeting_title: "Hello there!",
    greeting_subtitle: "How can I help you today?",
  };

  // Component to handle template selection and form population
  const TemplateSelector = () => {
    const { setValue, reset } = useFormContext();
    const { data: identity } = useGetIdentity();

    useEffect(() => {
      if (selectedTemplateId === "none") {
        // Reset to default values when "None" is selected
        const baseDefaults = {
          provider: "mistral",
          model_name: "pixtral-12b",
          temperature: "0.7",
          max_tokens: "4000",
          memory_limit: 10,
          rag_enabled: false,
          active: true,
          files: [],
          suggestions: [],
          greeting_title: "Hello there!",
          greeting_subtitle: "How can I help you today?",
          api_key: "",
        };
        const defaults = {
          ...baseDefaults,
          user_id: identity?.id || "",
        };
        reset(defaults);
        // Ensure user_id is set from identity
        if (identity?.id) {
          setValue("user_id", identity.id);
        }
      } else {
        // Find the selected template
        const template = assistantTemplates.find(
          (t) => t.id === selectedTemplateId,
        );
        if (template) {
          // Populate form with template values
          setValue("name", template.name);
          setValue("provider", template.provider);
          setValue("model_name", template.model_name);
          setValue("system_prompt", template.system_prompt);
          setValue("suggestions", template.suggestions);
          setValue("temperature", template.temperature);
          setValue("max_tokens", template.max_tokens);
          setValue("memory_limit", template.memory_limit);
          setValue("rag_enabled", template.rag_enabled);
          setValue("files", template.files);
          setValue("active", template.active);
          setValue("greeting_title", template.greeting_title);
          setValue("greeting_subtitle", template.greeting_subtitle);
          if (template.api_key) {
            setValue("api_key", template.api_key);
          } else {
            setValue("api_key", "");
          }
          // Preserve user_id from identity (don't overwrite with template)
          if (identity?.id) {
            setValue("user_id", identity.id);
          }
        }
      }
    }, [selectedTemplateId, setValue, reset, identity]);

    return null;
  };

  return (
    <Create
      mutationOptions={{
        onSuccess: (data) => {
          notify("assistant created successfully", { type: "success" });
          redirect("list", "assistants");
        },
      }}
    >
      <SimpleForm defaultValues={defaultValues}>
        {/* Set user_id dynamically when identity loads */}
        <SetUserIdField />
        
        {/* Template selector component */}
        <TemplateSelector />
        
        {/* Template selection dropdown */}
        <div className="space-y-2">
          <Label htmlFor="template-select">Template</Label>
          <Select
            value={selectedTemplateId}
            onValueChange={setSelectedTemplateId}
          >
            <SelectTrigger id="template-select" className="w-full">
              <SelectValue placeholder="Select a template..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Custom Assistant</SelectItem>
              {assistantTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Hidden field for user_id - not visible but included in form submission */}
        <TextInput source="user_id" style={{ display: "none" }} />
        
        {/* Required fields */}
        <TextInput source="name" validate={[required()]} />
        <SelectInput source="provider" choices={providerChoices} validate={[required()]} />
        <SelectInput source="model_name" choices={modelChoices} validate={[required()]} />
        
        {/* Optional fields with defaults */}
        <TextInput source="system_prompt" multiline rows={4}   validate={required()}/>
      
       
        {/* <BooleanInput source="rag_enabled" /> */}
       
      
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

        
        {/* <ArrayInput source="files">
          <SimpleFormIterator>
            {/* @ts-expect-error - source is not needed for scalar arrays */}
            {/* <TextInput placeholder="Enter a file" />
          </SimpleFormIterator>
        </ArrayInput> */}
      </SimpleForm>
    </Create>
  );
};

