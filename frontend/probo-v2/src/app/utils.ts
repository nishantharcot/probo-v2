function entriesToObject(entries: [string, any][]): { [key: string]: any } {
    const obj: { [key: string]: any } = {};
    entries.forEach(([key, value]) => {
      obj[key] = value;
    });
    return obj;
}
  
function getEntries(obj: { [key: string]: any }): [string, any][] {
const entries: [string, any][] = [];
for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
    entries.push([key, obj[key]]);
    }
}
return entries;
}
  


type OrderDetails = {
    total: number,
    orders: Map<string, number>
}

type OrderPrice = {
    [price: string]: OrderDetails
}

type OrderType = {
    yes?: OrderPrice
    no?: OrderPrice
}

export type OrderBook = Map<string, OrderType>

export function deserializeOrderBook(json: string): OrderBook {
    const parsedArray = JSON.parse(json);
    console.log(parsedArray)
    return new Map(
      parsedArray.map(([key, orderType]) => {
        return [
            key,
            {
              yes: orderType.yes
                ? entriesToObject(
                    getEntries(orderType.yes).map(([price, orderDetails]) => [
                      price,
                      {
                        total: orderDetails.total,
                        orders: new Map(orderDetails.orders),
                      },
                    ])
                  )
                : undefined,
              no: orderType.no
                ? entriesToObject(
                    getEntries(orderType.no).map(([price, orderDetails]) => [
                      price,
                      {
                        total: orderDetails.total,
                        orders: new Map(orderDetails.orders),
                      },
                    ])
                  )
                : undefined,
            },
        ]
})
    );
  }