import { ThemeToggle } from "../components/ThemeToggle";
import { ArrowRight, Lock, Receipt, Mail } from "lucide-react";
import { Form, Link } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

function LoginPage() {
  return (
    <div className="bg-background h-screen">
      <div className="flex justify-end p-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="bg-primary m-auto w-fit rounded-xl p-5">
          <Receipt className="text-background" size={30} />
        </div>
        <p className="text-foreground text-center text-3xl font-bold">
          Welcome Back
        </p>
        <p className="text-muted-foreground text-center">
          Sign in to continue to SplitEase
        </p>
        <Form
          method="post"
          className="bg-card border-border flex w-4/5 flex-col gap-6 rounded-lg border px-6 py-8 sm:w-3/4 md:w-2/4 lg:w-2/6"
        >
          <Input
            id="email"
            type="email"
            name="email"
            label="Email"
            icon={<Mail />}
            placeholder="you@example.com"
            className="text-foreground mt-3 h-12 pl-10"
          />

          <Input
            id="password"
            type="password"
            name="password"
            label="Password"
            icon={<Lock />}
            placeholder="••••••••"
            className=""
          />

          <Button
            type="submit"
            className="bg-primary mt-4 w-full border-none text-white"
          >
            <p>Sign In</p>
            <ArrowRight size={15} />
          </Button>
          <p className="text-muted-foreground text-center font-semibold">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;

export async function action({ request }) {
  const data = await request.formData();
  console.log(request.method);
  console.log(data.get("email"));
  console.log(data.get("password"));
}
