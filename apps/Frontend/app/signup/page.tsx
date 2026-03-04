import { AuthPage } from "@/app/AuthPage";

export default function SignUpPage() {
  return (
    <main className="bg-black text-white">
      <AuthPage isSignin={false} />
    </main>
  );
}