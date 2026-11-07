// Types for schema-blocks.mjs (the parser reads src/content.config.ts as text).

export interface SchemaField {
  key: string;
  expr: string;
}

export type SharedPiece = { kind: 'enum'; values: string[] } | { kind: 'object'; fields: SchemaField[] };

export interface ParsedSchema {
  blocks: Map<string, SchemaField[]>;
  shared: Map<string, SharedPiece>;
}

export function matchClose(text: string, openIdx: number): number;
export function stripComments(text: string): string;
export function splitTopLevel(body: string): string[];
export function parseSchema(source: string): ParsedSchema;
export function describeField(
  expr: string,
  shared?: Map<string, SharedPiece>,
): { type: string; optional: boolean; dflt: string };
export function enumOptions(
  fields: SchemaField[],
  shared?: Map<string, SharedPiece>,
): { key: string; values: string[] }[];
