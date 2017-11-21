---
layout: post
title: "使用node-xlsx进行excel文件的读写"
date: 2016-03-04 14:54:54 +0800
comments: true
categories: [node]
---

### 解析excel文件
在我的应用中需要对excel文件内容进行搜索，所以需要一个解析excel文件的插件。

[node-xlsx](https://www.npmjs.com/package/node-xlsx)插件可以让我们解析、修改、新建excel文件。

<!-- more -->

安装到所在文件夹：

```
npm install excel node-xlsx
```

或者安装为全局应用：

```
npm install -g excel node-xlsx
```

然后就可以这样解析excel文件：

```javascript
var xlsx = require('node-xlsx');
var obj = xlsx.parse(__dirname + '/myFile.xlsx'); // parses a file 
```

下面是一段样例代码：

```javascript

// Include modules.
var xlsx = require('node-xlsx');

// read xlsx file and analyse
var excelObj = xlsx.parse('fileName.xlsx');

for (var sheet in excelObj) {
	if (sheet !== '0' && excelObj.hasOwnProperty(sheet)) { // sheet is '0', '1', ...
		var sheetData = excelObj[sheet].data; // data inside a sheet, which is an two-dimention array
		var rowCount = sheetData.length;
		activityCountDic[sheet] = rowCount;
		for (var i = 1; i < rowCount; i++) {
			var rowData = sheetData[i]; // data inside one row, which is an one-dimention array
			var columnCount = rowData.length;
			for (var j = 0; j < columnCount; j++) {
				var cellData = rowData[j].toString(); // data in j column of the given row
				console.log(cellData);
			}
		}
	}
}
```

### 写入excel文件

```javascript
// Include modules.
var xlsx = require('node-xlsx');
var fs = require('fs');

// 写入excel之后是一个一行两列的表格
var data1 = [
['name', 'age']
];

// 写入excel之后是一个三行两列的表格
var data2 = [
['name', 'age'], 
['zhang san', '10'], 
['li si', '11']
];

var buffer = xlsx.build([
	{
		name:'sheet1',
		data:data1
	}, {
		name:'sheet2',
		data:data2
	}
	]);

fs.writeFileSync('book.xlsx', buffer, {'flag':'w'}); // 如果文件存在，覆盖
```