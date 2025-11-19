"use client";

import Link from "next/link";

export default function GetStartButtonClient({
  loggedIn,
}: {
  loggedIn: boolean;
}) {
  return (
    <Link href={loggedIn ? "/dashboard" : "/login"}>
      {loggedIn ? "Go to Dashboard" : "Get Started"}
    </Link>
  );
}
