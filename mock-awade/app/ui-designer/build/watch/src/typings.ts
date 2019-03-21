
export type ImportType = "source" | "resource" | "std_node_modules" | "non_std_node_modules" | "node_built_in";
export type ImportFile = { from: string, identifiers: string[], type: ImportType };
export type ImportedFileMap = { [path: string]: ImportFile[] };
export type InjectedParam = { name: string, type: string, from: string };
export type ChangeEvent = 'add' | 'change' | 'unlink' | 'ref';
export type Change = { compiled?: string, path: string, event: ChangeEvent };
export type ProcessedContent = { content: string, from: string };
