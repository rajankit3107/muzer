"use client";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

export function AppBar() {
  const session = useSession();
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer transition-transform duration-200 hover:scale-105">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-colors duration-200">
            <Music className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Muzer</span>
        </div>
        {session.data?.user && (
          <Button
            onClick={() => signOut()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer transition-all duration-200 hover:scale-105"
          >
            Logout
          </Button>
        )}
        {!session.data?.user && (
          <Button
            onClick={() => signIn()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer transition-all duration-200 hover:scale-105"
          >
            Sign in with Google
          </Button>
        )}
      </div>
    </header>
  );
}
