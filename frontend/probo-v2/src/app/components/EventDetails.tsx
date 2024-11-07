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

export function TableDemo() {
  return (
    <div className="p-6">
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
          {stockPrices.map((stock) => (
            <TableRow key={stock.id}>
              <TableCell className="font-medium">{stock.price}</TableCell>
              <TableCell className="text-right">{stock.quantity}</TableCell>
              {/* <TableCell>{invoice.paymentMethod}</TableCell> */}
              {/* <TableCell className="text-">{invoice.totalAmount}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
