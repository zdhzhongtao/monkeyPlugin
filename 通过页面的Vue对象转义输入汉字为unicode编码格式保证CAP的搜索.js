/*
 * @Author: Wade Zhong wzhong@hso.com
 * @Date: 2024-03-13 18:55:47
 * @LastEditTime: 2024-03-22 13:39:55
 * @LastEditors: Wade Zhong wzhong@hso.com
 * @Description:
 * @FilePath: \monkeyPlugin\通过页面的Vue对象转义输入汉字为unicode编码格式保证CAP的搜索.js
 * Copyright (c) 2024 by Wade Zhong wzhong@hso.com, All Rights Reserved.
 */
// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-03-13
// @description  try to take over the world!
// @author       You
// @match        https://basemiddleware-i.xgimi.com/cap/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xgimi.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  setTimeout(() => {
    callback();
  }, 1000);
  function callback() {
    // Your code here...
    // 找到包含“搜索”的按钮节点
    const buttons = document.querySelectorAll("button");
    const appElement = document.getElementById("app");
    const vueInstance = appElement.__vue__;

    buttons.forEach((button) => {
      console.log(button);
      if (
        button.textContent.includes("搜索") ||
        button.textContent.includes("Search")
      ) {
        addContentButtonNode(button);

        // 复制一份按钮节点
        const clonedButton = button.cloneNode(true);

        // 修改复制的按钮的文本为“中文搜索”
        clonedButton.textContent = "Chinese";

        // 将复制的按钮添加到原按钮的后面
        button.parentNode.insertBefore(clonedButton, button.nextSibling);

        // 绑定 click 事件到复制的按钮节点
        clonedButton.addEventListener("click", () => {
          // 在这里添加你想要执行的点击事件逻辑
          console.log("复制的按钮被点击了！");

          // 获取 id 为 clonedButton 的输入元素
          const clonedInput = document.getElementById(
            "inline-form-input-content"
          );

          const chineseCharacter = clonedInput.value;
          let unicodeStringURI = ""; // 用于存储 Unicode 编码的字符串
          let unicodeString = ""; // 用于存储 Unicode 编码的字符串

          for (let i = 0; i < chineseCharacter.length; i++) {
            const unicode = chineseCharacter.charCodeAt(i).toString(16); // 获取每个字符的 Unicode 编码
            unicodeStringURI += `%5C%5C%5Cu${unicode}`; // 将 Unicode 编码添加到结果字符串中
            unicodeString += `%${unicode}`;
            // console.log("unicodeString::: ", unicodeStringURI);
          }
          unicodeString += `%`;
          //   console.log(unicodeStringURI); // 输出："\u597d\u7684\u5462\uff0c\u6211\u77e5\u9053\u4e86"
          // 修改输入元素的值为“你好”
          clonedInput.value = unicodeString; //decodeURI(unicodeStringURI);

          //感觉好像没啥用。需要点击搜索
          //   vueInstance.$forceUpdate();
          //   // 假设你的组件名称是MyComponent
          //   const myComponentInstance = vueInstance.$children.find(
          //     (child) => typeof child.onSearch === "function"
          //   );
          //   //   console.log("MyChildComponent found.", myComponentInstance);
          //   // 修改MyComponent组件的data值
          //   if (myComponentInstance) {
          //     // console.log(
          //     //   "myComponentInstance._data::: ",
          //     //   myComponentInstance._data
          //     // );
          //     myComponentInstance._data.Content = unicodeString; // 注意：这里使用了私有属性 _data
          //     myComponentInstance.$forceUpdate();
          //   } else {
          //     console.error("MyChildComponent not found.");
          //   }
            setTimeout(() => {
              button.click();
            }, 500);
            setTimeout(() => {
              button.click();
            }, 500);
            setTimeout(() => {
              button.click();
            }, 500);
        });
      }
    });
  }

  function addContentButtonNode(button) {
    // 复制一份按钮节点
    const clonedAddContentButton = button.cloneNode(true);

    // 修改复制的按钮的文本为“中文搜索”
    clonedAddContentButton.textContent = "AddContent";

    // 将复制的按钮添加到原按钮的后面
    button.parentNode.insertBefore(clonedAddContentButton, button.nextSibling);
    clonedAddContentButton.addEventListener("click", () => {
      addContent();
    });
  }

  function addContent() {
    const appElement = document.getElementById("app");
    const vueInstance = appElement.__vue__;

    const myComponentInstance = vueInstance.$children.find(
      (child) => typeof child.onSearch === "function"
    );
    // console.log("myComponentInstance", myComponentInstance);
    var myTableComponentInstance = myComponentInstance.$children.find(
      (child) => typeof child.getTbodyTrIndex === "function"
    );
    // console.log(
    //   "myTableComponentInstance::: ",
    //   myTableComponentInstance._data.localItems
    // );

    // 获取table元素
    var table = document.getElementById("datatable");
    // 在表头添加一个新的列
    var header = table.createTHead().rows[0];
    var newHeaderCell = header.insertCell(-1);
    newHeaderCell.outerHTML = "<th>cap-exception</th>";

    // 遍历table的每一行，从第二行开始，因为第一行是表头
    console.log("table.rows::: ", table.rows);

    if (
      myTableComponentInstance._data.localItems.length ==
      table.rows.length - 1
    ) {
      // 遍历table的每一行，从第二行开始，因为第一行是表头
      for (var i = 1, row; (row = table.rows[i]); i++) {
        // 在每一行的最后添加一个新的单元格
        var newCell = row.insertCell(-1);
        var chineseStr = unescape(
          myTableComponentInstance._data.localItems[i - 1].content.replace(
            /\\u/g,
            "%u"
          )
        );
        // 填充新单元格的值
        newCell.innerHTML = chineseStr;
      }
    }
  }
})();
