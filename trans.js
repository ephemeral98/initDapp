const fs = require('fs');
const path = require('path');
const readline = require('readline/promises');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const { stdin: input, stdout: output } = require('process');
const ac = new AbortController();
const signal = ac.signal;

class Translate {
  constructor() {
    // 匹配文件中存在的 $t('')内容
    this.matchT =
      /(?:this\.\$t\(\')([a-zA-Z0-9.\-_]+)(?:\'\))|(?:{{$t\(')([a-zA-Z0-9.\-_]+)(?:'\)}})|(?:\$t\(\n?\s*[`'"]{1}([\s\S]*?)[`'"]{1}\n?\s*\))/g;

    // 匹配文件中存在的 $p('')内容
    this.matchP =
      /(?:this\.\$p\(\')([a-zA-Z0-9.\-_]+)(?:\'\))|(?:{{$p\(')([a-zA-Z0-9.\-_]+)(?:'\)}})|(?:\$p\(\n?\s*[`'"]{1}([\s\S]*?)[`'"]{1}\n?\s*\))/g;

    // 匹配文件中存在的 $f('')内容
    this.matchF =
      /(?:{{$f\(')([a-zA-Z0-9.\-_]+)(?:'\)}})|(?:\$f\(\n?\s*[`'"]{1}([\s\S]*?)[`'"]{1}\n?\s*\))/g;

    // 语言
    this.lang = 'en';

    // 匹配路径
    this.dirPath = './src';

    // 转化后的语言包路径
    this.i18nFilePath = `./src/locales/${this.lang}.json`;

    // 忽略的文件夹
    this.ignoreDirs = ['node_modules', '.git', 'assets'];

    // 忽略的文件名
    this.ignoreFiles = ['.DS_Store', 'translate.js'];

    // 用来装着匹配到的文件路径
    this.countFileDir = [];

    // 用来装匹配到的p模板内容
    this.countP = [];

    // 用来装匹配到的f模板内容
    this.countF = [];

    this.arr = [];
  }

  /**
   * 获取需要替换的内容，将它替换为 $t('')
   * @param {p | f} type
   * @param {String} str
   * @returns
   */
  getReplacement(type, str) {
    if (type === 'p') {
      return Promise.resolve(`$t('${str}')`);
    } else {
      return Promise.resolve(`$t('${str}')`);
    }
  }

  /**
   * 递归读取目录，获取匹配的文件路径
   * @param {*} dirPath 路径
   */
  async readDirRecursive(dirPath, fileList = []) {
    const files = fs.readdirSync(dirPath);

    const resp = files
      .map(async (file) => {
        const filePath = path.join(dirPath, file);

        if (this.ignoreDirs.includes(file) || this.ignoreFiles.includes(file)) {
          return;
        }

        if (fs.statSync(filePath).isDirectory()) {
          this.readDirRecursive(filePath, fileList);
        } else if (path.extname(filePath) === '.vue' || path.extname(filePath) === '.ts') {
          const resp = await readFileAsync(filePath, 'utf8');
          // console.log('resp...', resp);
          return resp;
        }
        // return arr;
      })
      .filter((item) => item);

    this.arr.push(resp.flat(Infinity));
  }

  /**
   * 创建 en.json 目录
   * @param {*} path_way
   * @returns
   */
  doReadExitFile(path_way) {
    return new Promise((resolve, reject) => {
      fs.access(path_way, async (err) => {
        if (err) {
          /*  await writeFileAsync(path_way, '{}', 'utf-8', (e) => {
          reject(false);
        }); */
        } else {
          const bakContent_file = fs.readFileSync(path_way, 'utf8');
          const bakContent = JSON.parse(bakContent_file);
          resolve(bakContent);
        }
      });
    });
  }

  /**
   *
   * @param {String} fileDir 各个文件目录，(不是数组)
   * @param {*} fileContent
   * @param {*} regex
   * @param {*} pathName
   * @param {*} translationsMap
   * @param {*} bakContent
   * @returns
   */
  async replaceContent(fileDir, fileContent, regex, pathName, translationsMap, bakContent) {
    let index = 1;
    const promises = [];
    const key = pathName.split('_')[0] || 'src';

    // 替换内容
    fileContent.replace(regex, async (match, p1, p2, p3) => {
      // console.log('translationsMap...', translationsMap[key]);

      // console.log('pppp', match, p1, p2, p3);
      if (regex === this.matchP) {
        this.countP.push(p1, p2, p3);
        this.countP = this.countP.filter((item) => typeof item === 'string');
        this.countP = Array.from(new Set(this.countP));
      } else {
        this.countF.push(p1, p2, p3);
        this.countF = this.countF.filter((item) => typeof item === 'string');
        this.countF = Array.from(new Set(this.countF));
      }

      translationsMap[key] = { ...translationsMap[key] } || {};

      // 合并 bak 文件内容
      if (translationsMap[key] || bakContent[key]) {
        translationsMap[key] = { ...bakContent[key], ...translationsMap[key] };
        index = Object.keys(translationsMap[key]).length + 1;
      }
      // 去重
      if (!Object.values(translationsMap[key])?.includes(p1 || p2 || p3)) {
        // translationsMap[key][index] = p1 || p2 || p3;
      } else {
        // 重写index
        for (const [inx, value] of Object.entries(translationsMap[key])) {
          if ([p1, p2, p3].includes(value)) {
            index = inx;
          }
        }
      }
      if (regex === this.matchP) {
        promises.push(this.getReplacement(index, 'p'));
      } else {
        promises.push(this.getReplacement(index, 'f'));
      }
    });

    const promiseRes = await Promise.all(promises);
    if (promiseRes.length) {
      // console.log('output...[1,2]', promiseRes);

      // 这里是将所有文件都匹配完后的结果，只差写入各个文件了
      const output = fileContent.replace(regex, () => promiseRes.shift());

      console.log('output...', output);
      // await writeFileAsync(fileDir, output, 'utf-8');
    }
    // console.log('firDir...', fileDir);
    return translationsMap[key];
  }

  /**
   * 匹配所有 i18n 多语言标记并提取翻译
   * @param {*} fileList
   * @returns
   */
  async extractTranslations(fileList) {
    const translationsMap = {};

    for (const fileDir of fileList) {
      const content = fs.readFileSync(fileDir, 'utf8');

      // 检查文件是否存在于当前目录中、以及是否可写。
      let bakContent = {};
      try {
        const res = await this.doReadExitFile(this.i18nFilePath);
        bakContent = res ?? {};
      } catch (error) {
        console.log('创建报错了');
        const res = await this.doReadExitFile(this.i18nFilePath);
        bakContent = res ?? {};
      }

      const pathName = path
        .dirname(fileDir)
        .replace(/^src[\\/]?/, '') // 去除 src 字段
        .replace(/^views[\\/]?/, '') // 去除 views 字段
        .replace(/[\\/]/g, '_') // 将路径分隔符转化为_
        .toLocaleLowerCase();

      await this.replaceContent(
        fileDir,
        content,
        this.matchF,
        pathName,
        translationsMap,
        bakContent
      );
      // 重新获取内容再次替换
      const newContent = fs.readFileSync(fileDir, 'utf8');
      await this.replaceContent(
        fileDir,
        newContent,
        this.matchP,
        pathName,
        translationsMap,
        bakContent
      );
    }

    return translationsMap;
  }

  async main() {
    this.countFileDir = await this.readDirRecursive(this.dirPath);

    this.arr = this.arr.flat(Infinity);
    // this.arr = this.arr.filter((item) => item);
    let resp = await Promise.all(this.arr);

    resp = resp.filter((item) => item);

    console.log('结果', resp);

    // console.log('countFileDir...', this.countFileDir);
    // const resp = await this.extractTranslations(this.countFileDir);
    // console.log('resp..', resp);
  }
}

new Translate().main();
