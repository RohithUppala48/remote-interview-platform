"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

export default function EditorPage() {
  const [documentId, setDocumentId] = useState<Id<"documents"> | null>(null);
  const [content, setContent] = useState("");
  const { theme } = useTheme();

  // Create a new document if none exists
  const createDocument = useMutation(api.documents.create);
  const updateDocument = useMutation(api.documents.update);
  const document = useQuery(api.documents.get, { id: documentId ?? undefined });

  useEffect(() => {
    const createNewDocument = async () => {
      const id = await createDocument();
      setDocumentId(id);
    };

    if (!documentId) {
      createNewDocument();
    }
  }, [documentId, createDocument]);

  useEffect(() => {
    if (document) {
      setContent(document.content);
    }
  }, [document]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && documentId) {
      setContent(value);
      updateDocument({ id: documentId, content: value });
    }
  };

  return (
    <div className="h-screen w-full">
      <Editor
        height="100vh"
        defaultLanguage="javascript"
        theme={theme === "dark" ? "vs-dark" : "light"}
        value={content}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          automaticLayout: true,
          tabSize: 2,
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
} 