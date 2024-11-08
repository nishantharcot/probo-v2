"use client";

import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function HomePage({ event }: { event: string }) {
  return (
    <div className="p-6">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Event {event}</CardTitle>
          <CardDescription>Check this event</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter className="flex justify-between">
          {/* <Button variant="outline">Cancel</Button>
            <Button>Deploy</Button> */}
        </CardFooter>
      </Card>
    </div>
  );
}
