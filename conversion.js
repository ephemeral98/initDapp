const fs = require('fs');
const path = require('path');
const readline = require('readline/promises');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const { stdin: input, stdout: output } = require('process');
const ac = new AbortController();
const signal = ac.signal;

// 要忽略的文件夹或文件名
const ignoreDirs = ['node_modules', '.git', 'assets'];
const ignoreFiles = ['.DS_Store', 'translate.js'];

// 匹配文件中存在的 $t('')内容
const regexBase =
  /(?:this\.\$t\(\')([a-zA-Z0-9.\-_]+)(?:\'\))|(?:{{$t\(')([a-zA-Z0-9.\-_]+)(?:'\)}})|(?:\$t\(\n?\s*[`'"]{1}([\s\S]*?)[`'"]{1}\n?\s*\))/g;

// 匹配文件中存在的 $p('')内容
const regexNew =
  /(?:this\.\$p\(\')([a-zA-Z0-9.\-_]+)(?:\'\))|(?:{{$p\(')([a-zA-Z0-9.\-_]+)(?:'\)}})|(?:\$p\(\n?\s*[`'"]{1}([\s\S]*?)[`'"]{1}\n?\s*\))/g;

// 匹配文件中存在的 $f('')内容
const regexFuc =
  /(?:{{$f\(')([a-zA-Z0-9.\-_]+)(?:'\)}})|(?:\$f\(\n?\s*[`'"]{1}([\s\S]*?)[`'"]{1}\n?\s*\))/g;

// 匹配$t('')内容的正则表达式
const regexTx = /\$p\((['"])(.*?)\1\)/g;

const language = 'en';
const dirPath = './src';
let i18nFilePath = `./src/locales/${language}.json`;

// 递归读取目录，获取匹配的文件路径
function readDirRecursive(dirPath, fileList = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);

    if (ignoreDirs.includes(file) || ignoreFiles.includes(file)) {
      return;
    }

    if (fs.statSync(filePath).isDirectory()) {
      readDirRecursive(filePath, fileList);
    } else if (path.extname(filePath) === '.vue' || path.extname(filePath) === '.ts') {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// 获取需要替换的内容，将它替换为 $t('')
const getReplacement = (str) => Promise.resolve(`$t('${str}')`);
const getBaseReplacement = (str) => Promise.resolve(`'${str}'`);

// 匹配所有 i18n 多语言标记并提取翻译
async function extractConversion(fileList) {
  const conversionMap = {};

  for (const fileDir of fileList) {
    const content = fs.readFileSync(fileDir, 'utf8');

    // 检查文件是否存在于当前目录中、以及是否可写。
    let bakContent = {};
    try {
      const res = await doReadExitFile(i18nFilePath);
      bakContent = res ?? {};
    } catch (error) {
      console.log('创建报错了');
      const res = await doReadExitFile(i18nFilePath);
      bakContent = res ?? {};
    }

    const pathName = path
      .dirname(fileDir)
      .replace(/^src[\\/]?/, '') // 去除 src 字段
      .replace(/^views[\\/]?/, '') // 去除 views 字段
      .replace(/[\\/]/g, '_') // 将路径分隔符转化为_
      .toLocaleLowerCase();

    await replaceContent(fileDir, content, regexFuc, pathName, conversionMap, bakContent);
    // 重新获取内容再次替换
    const newContent = fs.readFileSync(fileDir, 'utf8');
    await replaceContent(fileDir, newContent, regexNew, pathName, conversionMap, bakContent);
  }

  return conversionMap;
}

async function replaceContent(fileDir, fileContent, regex, pathName, conversionMap, bakContent) {
  let index = 1;
  const promises = [];
  const key = 'base';
  // 替换内容
  fileContent.replace(regex, async (match, p1, p2, p3) => {
    conversionMap[key] = { ...conversionMap[key] } || {};

    // 合并 bak 文件内容
    if (conversionMap[key] || bakContent[key]) {
      conversionMap[key] = { ...bakContent[key], ...conversionMap[key] };
      index = Object.keys(conversionMap[key]).length + 1;
    }
    // 去重
    if (!Object.values(conversionMap[key]).includes(p1 || p2 || p3)) {
      conversionMap[key][index] = p1 || p2 || p3;
    } else {
      // 重写index
      for (const [inx, value] of Object.entries(conversionMap[key])) {
        if ([p1, p2, p3].includes(value)) {
          index = inx;
        }
      }
    }

    if (regex === regexNew) {
      promises.push(getReplacement(`${key}.${index}`));
    } else {
      promises.push(getBaseReplacement(`${key}.${index}`));
    }
  });

  const promiseRes = await Promise.all(promises);
  if (promiseRes.length) {
    console.log('output...[1,2]', promiseRes);
    const output = fileContent.replace(regex, () => promiseRes.shift());
    await writeFileAsync(fileDir, output, 'utf-8');
  }
  return conversionMap[key];
}

/**
 * 创建 en.json 目录
 * @param {*} path_way
 * @returns
 */
function doReadExitFile(path_way) {
  return new Promise((resolve, reject) => {
    fs.access(path_way, async (err) => {
      if (err) {
        await writeFileAsync(path_way, '{}', 'utf-8', (e) => {
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
  const rl = readline.createInterface({ input, output });
  const timeoutInSeconds = 10;
  setTimeout(() => ac.abort(), timeoutInSeconds * 1000);
  try {
    const lang = await rl.question(
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
    rl.close();
  }

  // listen for close event
  rl.on('close', () => {
    console.log('Start to replace...');

    // exit the process
    process.exit(1);
  });
}

// 测试代码
async function main() {
  await readInpJsonDir();

  const fileList = readDirRecursive(dirPath);
  console.log('fileList...', fileList);
  const conversion = await extractConversion(fileList);
  await writeConversionToFile(conversion, i18nFilePath);

  console.log('Done');
}

main();
