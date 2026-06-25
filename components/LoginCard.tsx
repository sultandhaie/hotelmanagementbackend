"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { inter, playfair } from "../app/font";
import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LoginCard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
        }),
      });
      if (!res.ok) {
        toast.warning("Invalid Credentials");
        setError("Username or Password invalid");
        setLoading(false);
        return;
      }
      await router.push("/");
    } catch {
      console.log("Network error. Try again");
      setLoading(false);
    }
  };

  return (
    <Card className={`${inter.className} w-full max-w-sm`}>
      <CardHeader>
        <CardHeader className=" justify-center">
          <Image
            src="/logo.png"
            alt="Golden Hills Hotel"
            width={300}
            height={300}
            priority
          />
          <CardTitle
            className={`${playfair.className} text-2xl text-center mb-4`}
          >
            Hotel Management
          </CardTitle>
        </CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your username below to login to your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="mb-6">
          <div className="flex flex-col gap-6">
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Reception123"
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {!loading ? "Login" : "Wait"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
