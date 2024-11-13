import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

export function EventOrder({
  defaultYesPrice,
  defaultNoPrice,
  event,
}: {
  defaultYesPrice: number;
  defaultNoPrice: number;
  event: string;
}) {
  const [yesPrice, setYesPrice] = useState(defaultYesPrice);
  const [yesQuantity, setYesQuantity] = useState(0);
  const [noPrice, setNoPrice] = useState(defaultNoPrice);
  const [noQuantity, setNoQuantity] = useState(0);

  useEffect(() => {
    setYesPrice(defaultYesPrice);
    setNoPrice(defaultNoPrice);
  }, [defaultYesPrice, defaultNoPrice]);

  const handleMinusClick = (
    price: number,
    setPrice: Dispatch<SetStateAction<number>>,
    type: string
  ) => {
    if (type === "price") {
      if (price > 0.5) {
        setPrice(price - 0.5);
      }
    } else {
      if (price > 0) {
        setPrice(price - 1);
      }
    }
  };

  const handlePlusClick = (
    price: number,
    setPrice: Dispatch<SetStateAction<number>>,
    type: string
  ) => {
    if (type === "price") {
      if (price < 9.5) {
        setPrice(price + 0.5);
      }
    } else {
      if (price < 5) {
        setPrice(price + 1);
      }
    }
  };

  const buyStock = ({
    stockType,
    quantity,
    price,
  }: {
    stockType: string;
    quantity: number;
    price: number;
  }) => {
    fetch(API_URL + "/order/buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set content type to JSON
      },
      body: JSON.stringify({
        price: price * 100,
        quantity: quantity,
        stockType: stockType,
        stockSymbol: event,
        userId: "b1",
      }),
    })
      .then((res) => res.json())
      .then((finalRes) => console.log(finalRes));
  };

  return (
    <div className="p-6">
      <Tabs defaultValue="yesOrders" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="yesOrders">Yes</TabsTrigger>
          <TabsTrigger value="noOrders">No</TabsTrigger>
        </TabsList>
        <TabsContent value="yesOrders">
          <Card>
            <CardHeader>
              <CardTitle>Set Price</CardTitle>
              <CardDescription>
                <div className="flex flex-col gap-y-4">
                  <div className="flex justify-between">
                    <div>Price</div>
                    <div className="flex items-center gap-x-4 border p-2 border-solid">
                      <span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleMinusClick(yesPrice, setYesPrice, "price")
                          }
                        >
                          -
                        </Button>
                      </span>
                      <span>₹{yesPrice}</span>
                      <span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handlePlusClick(yesPrice, setYesPrice, "price")
                          }
                        >
                          +
                        </Button>
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>Quantity</div>
                    <div className="flex items-center gap-x-4 p-2 border border-solid">
                      <span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleMinusClick(
                              yesQuantity,
                              setYesQuantity,
                              "quantity"
                            )
                          }
                        >
                          -
                        </Button>
                      </span>
                      <span>{yesQuantity}</span>
                      <span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handlePlusClick(
                              yesQuantity,
                              setYesQuantity,
                              "quantity"
                            )
                          }
                        >
                          +
                        </Button>
                      </span>
                    </div>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2"></CardContent>
            <CardFooter>
              <Button
                onClick={() =>
                  buyStock({
                    stockType: "yes",
                    quantity: yesQuantity,
                    price: yesPrice,
                  })
                }
              >
                Place Order
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="noOrders">
          <Card>
            <CardHeader>
              <CardTitle>Set Price</CardTitle>
              <CardDescription>
                <div className="flex flex-col gap-y-4">
                  <div className="flex justify-between">
                    <div>Price</div>
                    <div className="flex items-center gap-x-4 border p-2 border-solid">
                      <span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleMinusClick(noPrice, setNoPrice, "price")
                          }
                        >
                          -
                        </Button>
                      </span>
                      <span>₹{noPrice}</span>
                      <span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handlePlusClick(noPrice, setNoPrice, "price")
                          }
                        >
                          +
                        </Button>
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>Quantity</div>
                    <div className="flex items-center gap-x-4 p-2 border border-solid">
                      <span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleMinusClick(
                              noQuantity,
                              setNoQuantity,
                              "quantity"
                            )
                          }
                        >
                          -
                        </Button>
                      </span>
                      <span>{noQuantity}</span>
                      <span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handlePlusClick(
                              noQuantity,
                              setNoQuantity,
                              "quantity"
                            )
                          }
                        >
                          +
                        </Button>
                      </span>
                    </div>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2"></CardContent>
            <CardFooter>
              <Button
                onClick={() =>
                  buyStock({
                    stockType: "no",
                    quantity: noQuantity,
                    price: noPrice,
                  })
                }
              >
                Place Order
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
