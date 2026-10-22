"use client";

import { useState } from "react";

export default function MyGpt() {
  const [res, setRes] = useState("");
  const [err, setError] = useState("");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setRes((c) => c + formData.get("chat") + "\n");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/chat/messages`,
        {
          method: "POST",
          body: formData,
        },
      );
      const json = await res.json();
      if (!res.ok) {
        console.log("ehek");
        setError(json.message);
        throw new Error(json.message ?? `HTTP ${res.status}`);
      }
      setRes((prev) => prev + json.data + "\n");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something when Wrong");
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      {res && (
        <div className={`flex-1 p-3`}>
          <p className="whitespace-pre-wrap">{res}</p>
        </div>
      )}
      <div
        className={`absolute inset-x-0 m-3 p-3 transition-all duration-500 ease-in-out ${
          !res ? "top-[25%]" : "top-full -translate-y-full -mt-6"
        }`}
      >
        <form className="flex gap-3" onSubmit={handleSubmit} method="post">
          {err && <p className="text-red-500 mb-2">{err}</p>}
          <input className="border flex flex-1 p-3" type="text" name="chat" />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
