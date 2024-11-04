"use client";

import { useEffect, useState } from "react";
import { deserializeOrderBook } from "./utils";
import { OrderBook } from "./utils";

export default function Home() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<OrderBook | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      console.log("Connected!");
      setSocket(socket);
    };

    socket.onmessage = (message) => {
      console.log("Message Received:- ", deserializeOrderBook(message.data));
      setMessage(deserializeOrderBook(message.data));
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (message !== null) {
      console.log(message.get("BTC"));
    }
  }, [message]);

  if (!socket) {
    return <div>Loading...</div>;
  }

  return <div>hello</div>;
}
