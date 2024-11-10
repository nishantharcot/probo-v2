"use client";

import { useEffect, useState } from "react";
import { deserializeOrderBook } from "./utils/helperFunctions";
import { OrderBook } from "./utils/helperFunctions";
import { EventDetails } from "@/components/ui/events/EventDetails";
import { EventCard } from "@/components/ui/events/EventCard";
import LandingScreen from "@/components/ui/LandingScreen";

export default function Home() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<OrderBook | null>(null);
  const [yesData, setYesData] = useState(null);
  const [noData, setNoData] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      console.log("Connected!");
      setSocket(socket);
    };

    socket.onmessage = (message) => {
      console.log("Message Received:- ", deserializeOrderBook(message.data));

      const res = deserializeOrderBook(message.data);

      console.log("res:- ", res.get("BTC")!.no!["10"].total);

      setMessage(deserializeOrderBook(message.data));
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (message !== null) {
      console.log(message);
    }
  }, [message]);

  if (!socket) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <LandingScreen />
    </div>
  );
}
