import { ThemeToggle } from "../components/ThemeToggle";
import { ArrowRight, Lock, Receipt, Mail } from "lucide-react";
import { Form, Link } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { redirect } from "react-router-dom";
import { toast } from "sonner";
import useInput from "../hooks/useInput";
import { validateEmail, validatePassword } from "../utils/FormValidation";

function LoginPage() {
  const {
    value: emailValue,
    handleChange: handleEmailChange,
    handleBlur: handleEmailBlur,
    error: emailError,
  } = useInput("", validateEmail);

  const {
    value: passwordValue,
    handleChange: handlePasswordChange,
    handleBlur: handlePasswordBlur,
    error: passwordError,
  } = useInput("", validatePassword);

  return (
    <div>
      <div className="absolute top-5 right-5">
        <ThemeToggle />
      </div>
      <div className="bg-background flex min-h-screen items-center justify-center p-5">
        <div className="flex w-full flex-col items-center gap-4">
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
              value={emailValue}
              error={emailError}
              icon={<Mail />}
              placeholder="you@example.com"
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
            />

            <Input
              id="password"
              type="password"
              name="password"
              label="Password"
              value={passwordValue}
              error={passwordError}
              icon={<Lock />}
              placeholder="••••••••"
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
            />

            <Button
              type="submit"
              disabled={emailError || passwordError}
              className="bg-primary mt-4 w-full border-none text-white disabled:opacity-50"
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
    </div>
  );
}

export default LoginPage;

export async function action({ request }) {
  const data = await request.formData();

  const authData = {
    email: data.get("email"),
    password: data.get("password"),
  };

  if (validateEmail(authData.email) || validatePassword(authData.password)) {
    toast.error("Please fill the form");
    return null;
  }

  toast.success("Logged in successfully!");

  return redirect("/home");
}
