"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export function AppBar() {
  const session = useSession();
  return (
    <div>
      <div className="flex justify-between">
        <div>muzer</div>
        <div>
          {session.data?.user && (
            <button
              className="m-2 p-2 bg-blue-300 cursor-pointer rounded-md"
              onClick={() => signOut()}
            >
              signout
            </button>
          )}
          {!session.data?.user && (
            <button
              className="m-2 p-2 bg-blue-300 cursor-pointer rounded-md"
              onClick={() => signIn()}
            >
              signin
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
