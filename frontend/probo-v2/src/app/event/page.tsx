"use client";

import { EventCard } from "@/components/ui/events/EventCard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

export default function EventPage() {
  const router = useRouter();

  const [eventList, setEventlist] = useState([]);

  function handleClick(stockSymbol: string) {
    router.push(`/event/${stockSymbol}`);
  }

  useEffect(() => {
    fetch(API_URL + "/orderbook")
      .then((res) => res.json())
      .then((res) => {
        let eList: any = [];
        res.forEach((ele: any) => {
          eList.push(ele[0]);
        });

        setEventlist(eList);
      });
  }, []);

  return (
    <div className="flex gap-x-6">
      {eventList.map((ele, index) => (
        <span
          id={index.toString()}
          key={index.toString()}
          onClick={() => handleClick(ele)}
        >
          <EventCard key={index} event={ele} />;
        </span>
      ))}
    </div>
  );
}
