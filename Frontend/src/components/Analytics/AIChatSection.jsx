import { Send, Sparkles } from "lucide-react";
import useInput from "../../hooks/useInput";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { apiFetch } from "../../utils/Fetch";
import { useState } from "react";

function AIChatSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [history, setHistory] = useState([]);

  const {
    value: question,
    handleChange: handleQuestionChange,
    handleBlur: handleQuestionBlur,
    error: questionError,
  } = useInput("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setResponse("");
    setIsLoading(true);

    const newHistory = [...history, { role: "user", content: question }];
    setHistory(newHistory);

    handleQuestionChange({ target: { value: "" } });

    try {
      const res = await apiFetch("/api/analytics/ai-chat", {
        method: "POST",
        body: { history: newHistory.slice(-5) },
      });

      if (!res.body) throw new Error("No stream returned");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullResponse += chunk;

        setResponse((prev) => prev + chunk);
      }

      setHistory((prev) => [
        ...prev,
        { role: "assistant", content: fullResponse },
      ]);
    } catch (err) {
      setResponse("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card border-border rounded-lg border p-8">
      <div className="text-foreground mb-5 flex items-center gap-2">
        <Sparkles className="text-primary size-5" />
        <h2 className="text-lg font-bold">AI Insights</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex w-full items-center justify-between gap-10 space-y-6"
      >
        <div className="w-full">
          <Input
            label="Ask questions about your spending habits"
            type="text"
            name="question"
            value={question}
            onChange={handleQuestionChange}
            onBlur={handleQuestionBlur}
            error={questionError}
            placeholder="Ask a question..."
          />
        </div>

        <Button
          type="submit"
          className={`py-4 ${isLoading ? "bg-primary/30" : "bg-primary mt-3"}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="border-primary-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </form>

      <div className="mt-6 flex flex-col gap-4">
        {history.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-5 py-3 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* streaming AI response */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted max-w-[70%] rounded-2xl px-5 py-3 text-sm">
              {response}
              <span className="animate-pulse">▍</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIChatSection;
