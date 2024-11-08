"use client";

import { EventCard } from "@/components/ui/events/EventCard";
import { useRouter } from "next/navigation";

export default function EventPage() {
  const router = useRouter();

  function handleClick() {
    router.push("/event/BTC");
  }

  return (
    <div onClick={handleClick}>
      <EventCard event="BTC" />;
    </div>
  );
}
