"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderType } from "@/app/types";
import { useEffect, useState } from "react";
import { SignalingManager } from "@/app/utils/SignalingManager";
import { deserializeOrderBookForEvent } from "@/app/utils/helperFunctions";
import { EventOrder } from "./EventOrder";
import { sortByPrice } from "@/app/utils/helperFunctions";

const API_URL = "http://localhost:3000";

const stockPrices = [
  {
    id: 1,
    symbol: "BTC",
    type: "No",
    quantity: 21,
    price: 7,
  },
  {
    id: 2,
    symbol: "BTC",
    type: "No",
    quantity: 8,
    price: 7.5,
  },
  {
    id: 3,
    symbol: "BTC",
    type: "No",
    quantity: 15,
    price: 8,
  },
  {
    id: 4,
    symbol: "BTC",
    type: "No",
    quantity: 30,
    price: 8.5,
  },
];

export function EventDetails({ event }: { event: string }) {
  const [yesData, setYesData] = useState<null | any[]>([]);
  const [noData, setNoData] = useState<null | any[]>([]);

  const [defaultYesPrice, setDefaultYesPrice] = useState(6.5);
  const [defaultNoPrice, setDefaultNoPrice] = useState(4.5);

  useEffect(() => {
    console.log("yo working!!");

    fetch(API_URL + `/orderbook/${event}`)
      .then((res) => {
        // console.log("res check:- ", res);
        return res.json();
      })
      .then((finalRes) => {
        console.log(finalRes);
        // const orderbook = deserializeOrderBookForEvent(finalRes[0]);
        const orderbook = finalRes[0];

        // console.log("orderbook check:- ", orderbook);

        const yesArray = [];
        const noArray = [];

        console.log(orderbook);

        for (const stockType of ["yes", "no"] as const) {
          if (!orderbook[stockType]) {
            continue;
          }
          const orderPrice = orderbook[stockType];
          let id = 1;

          if (orderPrice) {
            for (const price in orderPrice) {
              const orderDetails = orderPrice[price];
              const total = orderDetails.total;

              if (stockType == "yes") {
                yesArray.push({ id, price, quantity: total });
                id++;
              } else {
                noArray.push({ id, price, quantity: total });
                id++;
              }
            }
          }
        }

        setYesData(sortByPrice(yesArray));
        if (yesArray.length) {
          setDefaultYesPrice(Number(yesArray[0].price));
        }
        setNoData(sortByPrice(noArray));
        if (noArray.length) {
          setDefaultNoPrice(Number(noArray[0].price));
        }
      });

    SignalingManager.getInstance().registerCallback(
      event,
      (data: OrderType) => {
        console.log("data check:-", data);
        const orderbook = data;
        const yesArray = [];
        const noArray = [];

        // console.log(orderbook);

        for (const stockType of ["yes", "no"] as const) {
          if (!orderbook[stockType]) {
            continue;
          }
          const orderPrice = orderbook[stockType];
          let id = 1;

          if (orderPrice) {
            for (const price in orderPrice) {
              const orderDetails = orderPrice[price];
              const total = orderDetails.total;

              if (stockType == "yes") {
                yesArray.push({ id, price, quantity: total });
                id++;
              } else {
                noArray.push({ id, price, quantity: total });
                id++;
              }
            }
          }
        }

        setYesData(sortByPrice(yesArray));
        if (yesArray.length) {
          setDefaultYesPrice(Number(yesArray[0].price));
        }
        setNoData(sortByPrice(noArray));
        if (noArray.length) {
          setDefaultNoPrice(Number(noArray[0].price));
        }
      }
    );
    SignalingManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [event],
    });

    return () => {
      SignalingManager.getInstance().deRegisterCallback(event);
      SignalingManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [event],
      });
    };
  }, [event]);

  return (
    <div className="flex justify-between">
      <div className="p-6 flex gap-x-4">
        <div>
          <Table className="w-auto">
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Price</TableHead>
                <TableHead>
                  QTY AT&nbsp;
                  <span className="text-red-700">NO</span>
                </TableHead>
                {/* <TableHead>Method</TableHead> */}
                {/* <TableHead className="text-">Amount</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {noData &&
                noData.map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell className="font-medium">{stock.price}</TableCell>
                    <TableCell className="text-right">
                      {stock.quantity}
                    </TableCell>
                    {/* <TableCell>{invoice.paymentMethod}</TableCell> */}
                    {/* <TableCell className="text-">{invoice.totalAmount}</TableCell> */}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        <div>
          <Table className="w-auto">
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Price</TableHead>
                <TableHead>
                  QTY AT&nbsp;
                  <span className="text-blue-700">YES</span>
                </TableHead>
                {/* <TableHead>Method</TableHead> */}
                {/* <TableHead className="text-">Amount</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {yesData &&
                yesData.map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell className="font-medium">{stock.price}</TableCell>
                    <TableCell className="text-right">
                      {stock.quantity}
                    </TableCell>
                    {/* <TableCell>{invoice.paymentMethod}</TableCell> */}
                    {/* <TableCell className="text-">{invoice.totalAmount}</TableCell> */}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <EventOrder
        defaultNoPrice={defaultNoPrice}
        defaultYesPrice={defaultYesPrice}
        event={event}
      />
    </div>
  );
}
