let fs = require("fs")
let path = require("path")
let pako = require("pako");
const outputDir = require("./outputDir");

let origindir = "g_json";
let targetDir = "g_json_entrypted";


// let test = { "0": { "vip": 0, "exp": 60, "price": [[3, 0]], "cost": [[3, 238]], "item": [[1, 200000], [22, 100000], [37001, 2]], "adv_month_gift": [[3, 50], [29905, 1]], "battle_speed": 1, "dun_dialy_count": 0, "addition": [], "desc": 665100, "tab": 665200 }, "1": { "vip": 1, "exp": 300, "price": [[3, 238]], "cost": [[3, 888]], "item": [[10001, 300], [37001, 3], [1, 2000000]], "adv_month_gift": [[3, 100], [29905, 2]], "battle_speed": 2, "dun_dialy_count": 1, "addition": [["afk_coin", 100], ["afk_role_exp", 100], ["afk_hero_exp", 100], ["hero_bag", 25], ["afk_time", 2], ["convert", 200]], "desc": 665101, "tab": 665201 }, "2": { "vip": 2, "exp": 1000, "price": [[3, 688]], "cost": [[3, 2880]], "item": [[29404, 30], [29504, 30], [22, 2000000]], "adv_month_gift": [[3, 150], [29905, 3]], "battle_speed": 2, "dun_dialy_count": 1, "addition": [["afk_coin", 150], ["afk_role_exp", 150], ["afk_hero_exp", 150], ["hero_bag", 50], ["afk_time", 3], ["convert", 300]], "desc": 665102, "tab": 665202 }, "3": { "vip": 3, "exp": 2000, "price": [[3, 988]], "cost": [[3, 4288]], "item": [[37002, 1], [14001, 1], [1, 4000000]], "adv_month_gift": [[3, 200], [29905, 4]], "battle_speed": 2, "dun_dialy_count": 2, "addition": [["afk_coin", 200], ["afk_role_exp", 200], ["afk_hero_exp", 200], ["hero_bag", 75], ["afk_time", 4], ["convert", 400]], "desc": 665103, "tab": 665203 }, "4": { "vip": 4, "exp": 5000, "price": [[3, 1888]], "cost": [[3, 8888]], "item": [[29905, 50], [14001, 1], [22, 4000000]], "adv_month_gift": [[3, 250], [29905, 5]], "battle_speed": 3, "dun_dialy_count": 2, "addition": [["afk_coin", 300], ["afk_role_exp", 300], ["afk_hero_exp", 300], ["hero_bag", 100], ["afk_time", 5], ["convert", 600]], "desc": 665104, "tab": 665204 }, "5": { "vip": 5, "exp": 10000, "price": [[3, 2288]], "cost": [[3, 10880]], "item": [[60201, 1], [14001, 1], [1, 6000000]], "adv_month_gift": [[3, 300], [29905, 6]], "battle_speed": 3, "dun_dialy_count": 3, "addition": [["afk_coin", 400], ["afk_role_exp", 400], ["afk_hero_exp", 400], ["hero_bag", 125], ["afk_time", 6], ["convert", 800]], "desc": 665105, "tab": 665205 }, "6": { "vip": 6, "exp": 15000, "price": [[3, 3888]], "cost": [[3, 18880]], "item": [[60202, 1], [14001, 2], [10453, 1], [22, 6000000]], "adv_month_gift": [[3, 350], [29905, 7]], "battle_speed": 5, "dun_dialy_count": 3, "addition": [["afk_coin", 500], ["afk_role_exp", 500], ["afk_hero_exp", 500], ["hero_bag", 150], ["afk_time", 8], ["convert", 1000]], "desc": 665106, "tab": 665206 }, "7": { "vip": 7, "exp": 20000, "price": [[3, 4188]], "cost": [[3, 20880]], "item": [[60202, 1], [14001, 3], [10453, 1], [1, 8000000]], "adv_month_gift": [[3, 400], [29905, 8]], "battle_speed": 5, "dun_dialy_count": 4, "addition": [["afk_coin", 600], ["afk_role_exp", 600], ["afk_hero_exp", 600], ["hero_bag", 175], ["afk_time", 10], ["convert", 1200]], "desc": 665107, "tab": 665207 }, "8": { "vip": 8, "exp": 30000, "price": [[3, 4688]], "cost": [[3, 23880]], "item": [[60205, 1], [14001, 5], [40112, 1], [22, 8000000]], "adv_month_gift": [[3, 450], [29905, 9]], "battle_speed": 10, "dun_dialy_count": 4, "addition": [["afk_coin", 700], ["afk_role_exp", 700], ["afk_hero_exp", 700], ["hero_bag", 200], ["afk_time", 12], ["convert", 1400]], "desc": 665108, "tab": 665208 }, "9": { "vip": 9, "exp": 50000, "price": [[3, 4888]], "cost": [[3, 26880]], "item": [[60205, 1], [14001, 5], [40412, 1], [10801, 1], [1, 10000000]], "adv_month_gift": [[3, 500], [29905, 10]], "battle_speed": 10, "dun_dialy_count": 5, "addition": [["afk_coin", 800], ["afk_role_exp", 800], ["afk_hero_exp", 800], ["hero_bag", 230], ["afk_time", 14], ["convert", 1600]], "desc": 665109, "tab": 665209 }, "10": { "vip": 10, "exp": 100000, "price": [[3, 6888]], "cost": [[3, 38880]], "item": [[60205, 1], [10454, 1], [40312, 1], [22, 10000000]], "adv_month_gift": [[3, 600], [29905, 10]], "battle_speed": 10, "dun_dialy_count": 5, "addition": [["afk_coin", 900], ["afk_role_exp", 900], ["afk_hero_exp", 900], ["hero_bag", 260], ["afk_time", 16], ["convert", 1800]], "desc": 665110, "tab": 665210 }, "11": { "vip": 11, "exp": 150000, "price": [[3, 9880]], "cost": [[3, 58880]], "item": [[60205, 1], [29906, 50], [10454, 1], [40212, 1], [1, 15000000]], "adv_month_gift": [[3, 700], [29905, 10]], "battle_speed": 10, "dun_dialy_count": 6, "addition": [["afk_coin", 1000], ["afk_role_exp", 1000], ["afk_hero_exp", 1000], ["hero_bag", 290], ["afk_time", 18], ["convert", 2000]], "desc": 665111, "tab": 665211 }, "12": { "vip": 12, "exp": 300000, "price": [[3, 15880]], "cost": [[3, 98880]], "item": [[60205, 1], [29906, 100], [10454, 1], [14001, 10], [22, 15000000]], "adv_month_gift": [[3, 800], [29905, 10]], "battle_speed": 10, "dun_dialy_count": 6, "addition": [["afk_coin", 1100], ["afk_role_exp", 1100], ["afk_hero_exp", 1100], ["hero_bag", 320], ["afk_time", 20], ["convert", 2200]], "desc": 665112, "tab": 665212 }, "13": { "vip": 13, "exp": 0, "price": [[3, 18880]], "cost": [[3, 118880]], "item": [[60205, 1], [29906, 150], [10454, 2], [14001, 10], [1, 20000000]], "adv_month_gift": [[3, 1000], [29905, 10]], "battle_speed": 10, "dun_dialy_count": 7, "addition": [["afk_coin", 1250], ["afk_role_exp", 1250], ["afk_hero_exp", 1250], ["hero_bag", 350], ["afk_time", 22], ["convert", 2400]], "desc": 665113, "tab": 665213 } };
// let jsonStr = JSON.stringify(test);
// let s = pako.deflate(jsonStr, { to: 'string' });
// console.log(typeof s);
// console.log(pako.inflate(s, {to:"string"}));

async function entryptFromDir(dir) {
    let files = fs.readdirSync(dir);

    for (let f of files) {
        let st = fs.statSync(path.join(dir, f));

        if (st.isDirectory()) {
            await entryptFromDir(path.join(dir, f));
        } else if (st.isFile()) {
            entryptFile(f, dir);
        }
    }
}

module.exports = function entryptFile(f, dir) {
    if (path.extname(f) == ".json") {
        let p = path.join(dir, f);
        let str = fs.readFileSync(p, { encoding: "utf8" });
        let s = pako.deflate(str, { to: 'string' });

        let ep = p.replace(path.normalize(outputDir.json_dir), path.normalize(outputDir.json_entrypted_dir)).replace(".json", ".txt");
        writeFile(ep, s);
    }
}

function writeFile(file, data) {
    let dir = path.dirname(file);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }
    fs.writeFileSync(file, data, { encoding: "utf8" });
}

// export function entrypt(){
//     entryptFromDir(origindir);
// }
