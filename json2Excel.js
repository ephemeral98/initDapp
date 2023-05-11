const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const readline = require('readline/promises');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const { stdin: input, stdout: output } = require('process');
const ac = new AbortController();
const signal = ac.signal;

const language = 'cn';
const dirPath = './src';
let isToExcl = true;
let i18nFilePath = `./src/locales/${language}.json`;

/**
 * 创建 en.json 目录
 * @param {*} path_way
 * @returns
 */
function doReadExitFile(path_way) {
  return new Promise((resolve, reject) => {
    fs.access(path_way, async err => {
      if (err) {
        await writeFileAsync(path_way, '{}', 'utf-8', e => {
          reject(false);
        });
      } else {
        const bakContent_file = fs.readFileSync(path_way, 'utf8');
        const bakContent = JSON.parse(bakContent_file);
        resolve(bakContent);
      }
    });
  });
}

// 将翻译内容写入 JSON 文件
async function writeConversionToFile(conversion, filePath) {
  const curFile = fs.readFileSync(filePath, 'utf8');
  const fileContent = JSON.parse(curFile);
  const data = { ...fileContent, ...conversion };
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, jsonData);
}

/**
 * 询问生成文件
 */
async function readInpJsonDir() {
  const r2 = readline.createInterface({ input, output });
  const timeoutInSeconds = 10;
  setTimeout(() => ac.abort(), timeoutInSeconds * 1000);
  try {
    const lang = await r2.question(
      'What is the language you want to translate? (Default English)',
      { signal }
    );

    if (lang) {
      i18nFilePath = `./src/locales/${lang}.json`;
      console.log(`The generated directory will be ${`./src/locales/${lang}.json`}`);
    }
  } catch (err) {
    let message = 'Error: ';
    if (err.code === 'ABORT_ERR') {
      message = `You took too long. Try again within ${timeoutInSeconds} seconds.`;
    }
  } finally {
    r2.close();
  }

  // listen for close event
  r2.on('close', () => {
    console.log('Start to replace...');

    // exit the process
    process.exit(1);
  });
}



async function main() {
  await readInpJsonDir();

  await json2Excel();
}

/**
 * 转换Excel
 */
async function json2Excel() {
  const res = await doReadExitFile(i18nFilePath);
  const data = res.base;
  let wb = XLSX.utils.book_new();
  const jsonData = Object.values(data).map(item => [item]);
  console.log('json2Excel,,', jsonData);
  let ws = XLSX.utils.aoa_to_sheet([['content', 'translate'], ...jsonData]);
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, 'data.xlsx');
}


main();
