import axios from "axios";
import { Currency } from 'res/mongoDB';
async function lirarate() {
    let URL: string = 'https://lirarate.org/wp-json/lirarate/v2/rates?currency=LBP'
    let { data } = await axios.get(URL)
    let { buy, sell } = data

    data = { buy: buy[buy.length - 1], sell: sell[sell.length - 1] }

    let s = sell[sell.length - 1]
    let b = buy[buy.length - 1]

    data = {
        time: s[0],
        sell: s[1],
        buy: b[1],

    }
    console.log(data);
    
    let schema = {
        update: Number(data.time),
        name: 'lb',
        sell: data.sell,
        buy: data.buy,
        date: new Date().getTime(),
        type: 'local',
        updown: "Equal"
    }
    console.log(schema);

    let find: any = await Currency.findOne({ name: 'lb', sell: { $ne: schema.sell } })
        .sort({ _id: -1 })
        .select('sell')
    if (schema.sell > find?.sell) schema['updown'] = 'up'
    else if (schema.sell < find?.sell) schema['updown'] = 'down'

    Currency.create(schema)
    return schema
}
export default lirarate