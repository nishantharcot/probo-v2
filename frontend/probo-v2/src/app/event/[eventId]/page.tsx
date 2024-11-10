"use client";

import { EventDetails } from "@/components/ui/events/EventDetails";
import { use } from "react";

export default function EventDetailsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = use(params);
  console.log("eventId:- ", eventId);
  return <EventDetails event={eventId} />;
}
