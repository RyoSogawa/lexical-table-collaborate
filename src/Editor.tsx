import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import {
  type InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { EditorRefPlugin } from "@lexical/react/LexicalEditorRefPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import TableCellResizer from "./plugins/TableCellResizer";
import {
  INSERT_TABLE_COMMAND,
  TableCellNode,
  TableNode,
  TableRowNode,
} from "@lexical/table";
import type { EditorThemeClasses, LexicalEditor } from "lexical";
import { useRef } from "react";

const theme: EditorThemeClasses = {
};

const onError = (error: Error) => {
  console.error(error);
};

const Editor = () => {
  const editorRef = useRef<LexicalEditor>(null);
  const initialConfig: InitialConfigType = {
    namespace: "MyEditor",
    theme,
    nodes: [TableNode, TableCellNode, TableRowNode],
    onError,
  };

  const handleInsertTable = () => {
    editorRef.current?.dispatchCommand(INSERT_TABLE_COMMAND, {
      columns: "2",
      rows: "2",
      includeHeaders: true,
    });
  };

  return (
    <>
      <LexicalComposer initialConfig={initialConfig}>
        <EditorRefPlugin editorRef={editorRef} />
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor" />}
          placeholder={<div>Enter some text...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <TablePlugin />
        <TableCellResizer />
      </LexicalComposer>
      <button type="button" onClick={handleInsertTable}>
        Insert Table
      </button>
    </>
  );
};

export default Editor;
