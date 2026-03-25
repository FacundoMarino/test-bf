import { LoginForm } from "@/components/auth";

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
    registered?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const sp = await searchParams;
  const raw = sp.callbackUrl;
  const callbackUrl =
    typeof raw === "string" && raw.startsWith("/") ? raw : "/dashboard";
  const justRegistered = sp.registered === "1";

  return (
    <LoginForm callbackUrl={callbackUrl} justRegistered={justRegistered} />
  );
}
