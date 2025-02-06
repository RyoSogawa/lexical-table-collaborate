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
import { useCallback, useRef } from "react";
import * as Y from "yjs";
import { Provider } from "@lexical/yjs";
import { WebsocketProvider } from "y-websocket";
import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";

const theme: EditorThemeClasses = {};

const onError = (error: Error) => {
  console.error(error);
};

const getDocFromMap = (id: string, yjsDocMap: Map<string, Y.Doc>): Y.Doc => {
  let doc = yjsDocMap.get(id);

  if (doc === undefined) {
    doc = new Y.Doc();
    yjsDocMap.set(id, doc);
  } else {
    doc.load();
  }

  return doc;
};

const Editor = () => {
  const editorRef = useRef<LexicalEditor>(null);
  const initialConfig: InitialConfigType = {
    editorState: null,
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

  const providerFactory = useCallback(
    (id: string, yjsDocMap: Map<string, Y.Doc>): Provider => {
      const doc = getDocFromMap(id, yjsDocMap);

      return new WebsocketProvider(
        "ws://localhost:1234",
        id,
        doc,
      ) as unknown as Provider;
    },
    [],
  );

  return (
    <>
      <LexicalComposer initialConfig={initialConfig}>
        <EditorRefPlugin editorRef={editorRef} />
        <CollaborationPlugin
          id="lexical/collab"
          providerFactory={providerFactory}
          shouldBootstrap={false}
        />
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
