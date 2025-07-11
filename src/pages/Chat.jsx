import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Chat() {
  const [username, setUsername] = useState("");
  const [stream, setStream] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const outputRef = useRef(null);

  // Converts raw response into clean markdown
  const formatToMarkdown = (raw) => {
  if (!raw) return "";

  let formatted = raw
    .replace(/\r\n|\r/g, "\n")
    .replace(/(\w)\.(\w)/g, "$1§DOT§$2")
    .replace(/([a-z0-9])\.(\s*)([A-Z])/g, "$1.\n\n$3")
    .replace(/§DOT§/g, ".")
    .replace(/^([A-Z][^\n]{3,})\n/gm, "\n### $1\n")
    .replace(/:\s*\n(?=\w)/g, ":\n- ")
    .replace(/^\s*[\*\-]\s+/gm, "- ")
    .replace(/^(#+ .+)/gm, "\n$1\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+$/gm, "")
    .trim();

  return formatted;
};


  // Auto scroll to bottom when stream updates
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [stream]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/me", {
          withCredentials: true,
        });
        setUsername(res.data?.username || "Guest");
      } catch (err) {
        navigate("/login");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleSubmitPrompt = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setStream("");
    setIsStreaming(true);
    setError("");

    const eventSource = new EventSource(
      `http://localhost:3000/api/chat/generate?q=${encodeURIComponent(query)}`
    );

    eventSource.onmessage = (event) => {
      const rawText = event.data;
      const markdownText = formatToMarkdown(rawText);
      setStream((prev) => prev + "\n" + markdownText);
    };

    eventSource.addEventListener("done", () => {
      eventSource.close();
      setIsStreaming(false);
    });

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      setError("Something went wrong. Please try again.");
      eventSource.close();
      setIsStreaming(false);
    };

    setQuery("");
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
        <Link to="/chat" className="text-2xl font-bold">
          VedaAI
        </Link>
        <div className="flex items-center gap-4">
          <span>
            Hello, <strong>{username}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="bg-white text-black px-4 py-2 rounded-md font-semibold"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center p-6">
        {/* Prompt Form */}
        <form
          onSubmit={handleSubmitPrompt}
          className="w-full max-w-3xl flex gap-3 mb-4"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask something about AI, Ayurveda, etc..."
            className="flex-1 px-4 py-2 rounded-md text-black"
            disabled={isStreaming}
          />
          <button
            type="submit"
            className="bg-white text-black px-6 py-2 rounded-md font-bold"
            disabled={isStreaming}
          >
            {isStreaming ? "Thinking..." : "Send"}
          </button>
        </form>

        {/* Error Message */}
        {error && <div className="text-red-400 mb-2">{error}</div>}

        {/* Response Output */}
        <div
          ref={outputRef}
          className="w-full max-w-3xl h-[60vh] bg-gray-900 rounded-md p-4 overflow-y-auto text-base leading-relaxed prose prose-invert"
        >
          {stream ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{stream}</ReactMarkdown>
          ) : (
            <p className="text-gray-500">
              Enter a prompt to get an AI-powered response from VedaAI.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Chat;
