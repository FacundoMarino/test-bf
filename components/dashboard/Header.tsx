import { UserMenu } from "./UserMenu";

export function Header({ title = "Panel" }: { title?: string }) {
  return (
    <header className="border-border bg-background/80 sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b px-4 backdrop-blur-md transition-colors duration-150 ease-out md:px-6">
      <h1 className="font-mono text-sm font-medium tracking-tight text-muted-foreground">
        {title}
      </h1>
      <UserMenu />
    </header>
  );
}
