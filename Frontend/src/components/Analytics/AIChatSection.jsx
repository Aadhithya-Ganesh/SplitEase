import { Send, Sparkles } from "lucide-react";
import useInput from "../../hooks/useInput";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { apiFetch } from "../../utils/Fetch";
import { useState } from "react";

function AIChatSection() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    value: question,
    handleChange: handleQuestionChange,
    handleBlur: handleQuestionBlur,
    error: questionError,
  } = useInput("");

  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse("");
    setIsLoading(true);

    try {
      const res = await apiFetch("/api/analytics/ai-chat", {
        method: "POST",
        body: { question },
      });

      if (!res.body) throw new Error("No stream returned");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        setResponse((prev) => prev + chunk);
      }
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
      {(response || isLoading) && (
        <div className="rounded-3xl bg-green-400 px-10 py-6">
          <p className="mt-2 text-lg font-semibold">
            {response}
            {isLoading && <span className="animate-pulse">▍</span>}
          </p>
        </div>
      )}
    </div>
  );
}

export default AIChatSection;
