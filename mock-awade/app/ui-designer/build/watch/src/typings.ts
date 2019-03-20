
export type ImportFromType = "source" | "resource" | "std_node_modules" | "non_std_node_modules" | "node_built_in";
export type ImportedFile = { from: string, identifiers: string[], type: ImportFromType };
export type ImportedFileMap = { [path: string]: ImportedFile[] };
export type InjectedParam = { name: string, type: string, from: string };
export type ChangeEvent = 'add' | 'change' | 'unlink' | 'ref';
export type Change = { compiled?: string, path: string, event: ChangeEvent };
