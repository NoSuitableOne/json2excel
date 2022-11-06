import oldData from './data/old/index.zh-CN.js';
import newData from './data/new/index.zh-CN.js';
import { build } from 'node-xlsx';
import { writeFile } from 'fs';

function main () {
  // 旧数据处理
  const oldValues = Object.values(oldData);
  const oldValueSet = new Set([...oldValues]); 

  // 新数据处理
  const newKeys = Object.keys(newData);
  const newValueMap = new Map();
  newKeys.map(key => {
    let valueKey = newData[key];
    if (!oldValueSet.has(valueKey)) { // 旧值中没有
      if (newValueMap.has(valueKey)) {
        newValueMap.set(valueKey, [...newValueMap.get(valueKey), key]);
      } else {
        newValueMap.set(valueKey, [key]);
      } 
    }
  });
  let result = [['key', 'value']];
  if (newValueMap.size) {
    [...newValueMap.keys()].map(key => {
      newValueMap.get(key).map(v => {
        result.push([v, key]);
      });
    });
  }

  const xlsxData = [{
    name: 'sheet1',
    data: result
  }]; 

  const buffer = build(xlsxData);
  writeFile('result.xlsx', buffer, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('completed');
  });
}

main();