"use client";

import dynamic from "next/dynamic";

const Admin = dynamic(() => import("./admin/App"), {
  ssr: false, // Required to avoid react-router related errors
});

export default function Page() {
  return <Admin />;
}