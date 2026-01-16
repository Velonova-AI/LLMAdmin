"use client";

import dynamic from "next/dynamic";

const App = dynamic(() => import("./App"), {
  ssr: false, // Required to avoid react-router related errors
});

export default function Page() {
  return <App />;
}