import { Send, Sparkles } from "lucide-react";
import { useFetcher } from "react-router-dom";
import useInput from "../../hooks/useInput";
import Input from "../ui/Input";
import Button from "../ui/Button";

function AIChatSection() {
  const fetcher = useFetcher();
  const {
    value: question,
    handleChange: handleQuestionChange,
    handleBlur: handleQuestionBlur,
    error: questionError,
  } = useInput("");

  return (
    <div className="bg-card border-border rounded-lg border p-8">
      <div className="text-foreground mb-5 flex items-center gap-2">
        <Sparkles className="text-primary size-5" />
        <h2 className="text-lg font-bold">AI Insights</h2>
      </div>

      <fetcher.Form
        method="post"
        action={`/analytics/ai-chat`}
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
        <Button type="submit" className={"bg-primary py-4"}>
          <Send className="size-4" />
        </Button>
      </fetcher.Form>
    </div>
  );
}

export default AIChatSection;

export async function action({ request }) {
  const data = await request.formData();
  const question = data.get("question");

  console.log("Question asked:", question);

  return question;
}
