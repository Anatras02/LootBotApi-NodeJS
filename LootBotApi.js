const fetch = require("node-fetch");
const fs = require("fs");
var path = require("path");

function NotImplementedError(message = "") {
    this.name = "NotImplementedError";
    this.message = message;
}
NotImplementedError.prototype = Error.prototype;

class LootBotApi {
  constructor(token) {
    this.token = token
    this.endpoint = `http://fenixweb.net:3300/api/v2/${token}`;
    this.craft_needed = this.__load_json("craft_needed.json");
    this.INVENTORY_SYNTAX_ERROR = "The inventory should be in the format {'element':quantity}";
    this.chest_prices = {"C":2250,"NC":4500,"R":9000,"UR":13500,"L":27000,"E":45000};
  }

  async __request_url(url){
      let risultato = await fetch(url).then(res => res).then(json => { return json });
      let json = await risultato.json();
      let response_code = json.code;
      if(response_code != 200) return Promise.reject(Error(json));
      return json.res
  }

  __load_json(json_name){
    if (fs.existsSync(json_name)) return JSON.parse(fs.readFileSync(json_name, 'utf8'));
    else{
      let empty_json = "{}";
      fs.writeFile(json_name, empty_json,()=>{});
    }
  }

  async get_items(rarity=undefined){
      if(rarity != undefined) return this.get_item(rarity);
      if(this.items == undefined) this.items = await this.__request_url(`${this.endpoint}/items`);
      return this.items;
  }
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

let api = new LootBotApi("8JQplLaSFlLYy8pL11690");
(async () => {
  await api.test()
})();
