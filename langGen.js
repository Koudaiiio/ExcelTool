const fs = require("fs");

let langFile = "g_json/Lang_datas.json";
if (!fs.existsSync(langFile)) { 
    console.error("请先生成json文件");
    return;
}
let s = fs.readFileSync(langFile).toString();

/** @type {{ [id: number]: {id:number} }} */
let langs = JSON.parse(s);
/** @type {{ [langName:string] : {[langKey:string]:string} }} */
let langDict = { sChinese: {}, english: {} };
for (let id in langs) {
    let l = langs[id];
    for (let langName in langDict) {
        langDict[langName][l.id] = l[langName];
    }
}

s = JSON.stringify(langDict);
s = s.replace(/sChinese/g, "cn").replace(/english/g, "eng");
fs.writeFileSync("lang.json", s);
// console.log(langDict.sChinese[1100080151]);
    // fs.writeFileSync(dataFile, JSON.stringify(items));