import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
};

const markdownComponents: Components = {
  code({ inline, className, children, ...props }) {
    const language = /language-(\w+)/.exec(className || '')?.[1];
    if (inline) {
      return (
        <code className="inline-code" {...props}>
          {children}
        </code>
      );
    }
    return (
      <pre className={`code-block ${language ?? ''}`} {...props}>
        <code>{children}</code>
      </pre>
    );
  },
};

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isSending) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!res.ok) {
        throw new Error('Chat request failed');
      }

      const data: { reply: string } = await res.json();

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: Date.now() + 2,
        role: 'assistant',
        content: 'Error talking to backend. Is the server running on port 3001?',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.length === 0 && (
          <div className="empty-state">
            Ask anything about your finances. Once documents are ingested, the AI will use them as context.
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`message ${m.role}`}>
            <div className="message-role">{m.role === 'user' ? 'You' : 'Assistant'}</div>
            <div className="message-content">
              {m.role === 'assistant' ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {m.content}
                </ReactMarkdown>
              ) : (
                m.content
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question, e.g. “How much did I spend on groceries last month?”"
        />
        <button onClick={() => void sendMessage()} disabled={isSending || !input.trim()}>
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};


