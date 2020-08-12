let xlsx = require('node-xlsx');
let fs = require('fs');
let path = require('path');

//comment 空的不导出
//类型验证O
//不能为空的，必须有值
//类型为lang的

let PATHS = {
    excelDir: "../develop",
    dir: "gen",
    log: "",
    target: "json",
    excludes: "色码表.xlsx,配置表说明.xlsx,配置表模版.xlsx"
};

let ags = process.argv.splice(2);
ags.forEach(ag => {
    let [k, v] = ag.split("=");
    PATHS[k] = v;
});

let excludes = new Set(PATHS.excludes.split(","));

let errorLogs = {};
let A = "A".charCodeAt(0);

function getCsvValue(t, v) {
    if (v != undefined) return v;
    switch (t) {
        case "array":
            return "[]";
        case "string":
            return "";
        case "number":
            return 0;
    }
    return v;
}

function genAFile(fileName) {

    let sheets = xlsx.parse(fileName);
    let sheetName = sheets[0].name;

    errorLogs[sheetName] = [];

    let data = sheets[0].data;
    if (data.length < 3) return;
    let items = [];
    let csv = [[]];

    let columnLen = data[0].length;

    data.forEach((v, i) => {
        if (Number(i) > 2) {
            let o = {};
            items[Number(i - 3)] = o;
            // console.log(data[i]);

            let tj = 0;
            for (let j = 0; j < columnLen; j++) {
                // data[i].forEach((d, j) => {

                const key = String(data[0][j]).trim();
                const t = String(data[1][j]).toLowerCase();
                let v = data[i][j];
                if (j == 0 && !v) break;

                if (key == "undefined") continue;
                if (key.startsWith("comment")) continue;

                try {

                    if (t == "array") {

                        if (!v || typeof v == "number" || !v.startsWith("[")) {
                            v = v == undefined ? "[]" : `[${v}]`;
                        }
                        // v = String(v).replace(/{/g, "[").replace(/}/g, "]");
                        v = fillQuotes(v);
                        try {
                            v = JSON.parse(v)
                        } catch (e) {
                            errorLogs[sheetName].push(`[${i + 1}:${String.fromCharCode(j + A)}]字段${key}的值为array类型，但是解析错误:${v}`);
                            continue;
                        }
                    } else {
                        v = getCsvValue(t, v);
                    }
                } catch (e) {
                    console.log(`%c${sheetName}[${i + 1}:${String.fromCharCode(j + A)}]字段${key}的值解析错误`, "color:red");
                    // console.log(typeof v);
                    console.error(e);
                }
                o[key] = v;

                csv[0][tj] = data[0][j];
                if (!csv[i - 2]) csv[i - 2] = [];
                csv[i - 2][tj] = t == "array"
                    ?
                    `"${JSON.stringify(v).replace(/\"/g, "\"\"")}"`
                    :
                    t == "string" ? `"${v}"` : v;
                tj++;

                if (t == "number" && isNaN(o[key])) {
                    errorLogs[sheetName].push(`[${i + 1}:${String.fromCharCode(j + A)}]字段${key}的值应为number类型，目前为：${o[key]}`)
                }
            };
        }
    });


    let fields = [];

    data[0].forEach((v, i) => {
        let c = String(data[2][i]);
        if (!c) return;
        if (!v || v.startsWith("comment")) return;

        let t = String(data[1][i]).toLowerCase();
        if (t == "array") {
            t = "any[]";
        }
        if (t == "lang") {
            t = "number"
        }
        fields[i] = `\t/**${c} */\n\t${v}:${t}`;
    });


    let cls = `export interface ${sheetName}{\n${fields.join("\n")}\n}`;

    // console.log(items);
    // console.log(cls);

    let firstKey = String(data[0][0]).trim();
    let specialKey = specialKeys[sheetName];
    let itemsDict = {};

    items.forEach(item => {
        let k = item.id || item[firstKey];
        if (specialKey) {
            k = specialKey.map(key=>{
                return item[key];
            }).join("_");
        }
        if (!k) return;
        itemsDict[k] = item;
    })

    if (PATHS.target == "json") {
        let dataFile = path.join(PATHS.dir, sheetName + "_datas.json");

        writeFile(dataFile, JSON.stringify(itemsDict));
    }
    if (PATHS.target == "ts") {
        let classFile = path.join(PATHS.dir, sheetName + ".ts");
        writeFile(classFile, cls);
    }

    if (PATHS.target == "csv") {
        let csvStr = "";
        csv.forEach(r => {
            csvStr += r.join(",") + "\r\n";
        })
        let csvFile = path.join(PATHS.dir, sheetName + ".csv");
        writeFile(csvFile, csvStr);
    }
}
/** @type {{ [sheetName: string]: string[] }} */
let specialKeys = {
    "Hero_Break": ["id", "type", "count"]
}
/**
 * 
 * @param {string} arrStr 
 */
function fillQuotes(arrStr) {
    arrStr = String(arrStr).replace(/{/g, "[").replace(/}/g, "]");
    arrStr = arrStr.split(",").map(s => {
        return s == "" ? 0 : s;
    }).join(",");
    arrStr = arrStr.replace(/,]/g, ",0]");


    return arrStr.split("[").map(a => {
        return a.split("]").map(b => {
            // console.log(b);
            return b.split(",").map(c => {
                // if (b != "" && c == "") return 0;
                if (c.startsWith('"')) return c;
                if (c.startsWith("'")) return c.replace(/'/g, '"');
                return isNaN(c) ? `"${c}"` : c;
            }).join(",");

        }).join("]");
    }).join("[");

}

function writeFile(file, data) {
    let dir = path.dirname(file);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }
    fs.writeFileSync(file, data);
}

// genAFile("Battle_Act.xlsx");

if (PATHS.excelDir == "/") {
    PATHS.excelDir = __dirname;
}
function genFromDir(dir) {
    let files = fs.readdirSync(dir);
    files.forEach(f => {
        if (excludes.has(f)) return;
        if (f.startsWith('.') || f.startsWith("~")) return;
        let st = fs.statSync(path.join(dir, f));
        if (st.isDirectory()) {
            genFromDir(path.join(dir, f));
        } else if (st.isFile()) {
            if (path.extname(f) == ".xlsx") {
                // console.log("gen file:", f);
                genAFile(path.join(dir, f));
            }
        }
    });
}
genFromDir(PATHS.excelDir);
// return;
//check error log
let lc = 0;
let ec = 0;
for (let k in errorLogs) {
    let l = errorLogs[k];
    if (l.length > 0) {
        lc += 1;
        ec += l.length;
    }
}

let logFile = path.join(PATHS.log, "log.json");
if (lc > 0) {
    console.log(`%c总计有${lc}个表格产生${ec}个错误, 请打开logs.json查看详情`, "color:red");
    fs.writeFileSync(logFile, JSON.stringify(errorLogs, null, "\t"));
} else {
    console.log(`%c没有发现错误`, "color:green");
    fs.writeFileSync(logFile, '');
}


