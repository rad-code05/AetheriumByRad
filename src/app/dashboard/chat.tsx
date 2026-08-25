"use client";

import { useChat } from "@ai-sdk/react";

import { useEffect, useState } from "react";

import { useTRPC } from "@/trpc/client";

import { useMutation } from "@tanstack/react-query";

export function Chat() {
  const [input, setInput] = useState("");
  const trpc = useTRPC();
  const [projectId, setProjectId] = useState<string | null>(null);
  const createProject = useMutation(trpc.project.create.mutationOptions());
  const createMessage = useMutation(trpc.message.create.mutationOptions());

  useEffect(() => {
    createProject.mutate(
      {},
      {
        onSuccess: (project) => setProjectId(project.id),
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { messages, sendMessage } = useChat({
    onFinish: ({ message }) => {
      if (!projectId) return;

      const text = message.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join("");

      createMessage.mutate({ projectId, role: "assistant", content: text });
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (input.trim() && projectId) {
      sendMessage({ text: input });
      createMessage.mutate({ projectId, role: "user", content: input });
      setInput("");
    }
  }

  return (
    <div>
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            <strong>{message.role === "user" ? "You: " : "AI: "}</strong>
            {message.parts.map((part, i) =>
              part.type === "text" ? <span key={i}>{part.text}</span> : null,
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={projectId ? "Say something..." : "Setting up..."}
          disabled={!projectId}
        />
        <button type="submit" disabled={!projectId}>
          Send
        </button>
      </form>
    </div>
  );
}
