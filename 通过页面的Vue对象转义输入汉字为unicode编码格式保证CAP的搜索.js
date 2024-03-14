/*
 * @Author: Wade Zhong wzhong@hso.com
 * @Date: 2024-03-13 18:55:47
 * @LastEditTime: 2024-03-14 10:52:33
 * @LastEditors: Wade Zhong wzhong@hso.com
 * @Description:
 * @FilePath: \wwwrootc:\Users\wadePro\Desktop\Untitled-1.js
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
      if (button.textContent.includes("搜索")) {
        // 复制一份按钮节点
        const clonedButton = button.cloneNode(true);

        // 修改复制的按钮的文本为“中文搜索”
        clonedButton.textContent = "中文搜索";

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
            unicodeString += `\\  \\u${unicode}`;
            console.log("unicodeString::: ", unicodeStringURI);
          }

          console.log(unicodeStringURI); // 输出："\u597d\u7684\u5462\uff0c\u6211\u77e5\u9053\u4e86"
          // 修改输入元素的值为“你好”
          clonedInput.value = decodeURI(unicodeStringURI);
          vueInstance.$forceUpdate();
          // 假设你的组件名称是MyComponent
          const myComponentInstance = vueInstance.$children.find(
            (child) => typeof child.onSearch === "function"
          );
          console.log("MyChildComponent found.", myComponentInstance);
          // 修改MyComponent组件的data值
          if (myComponentInstance) {
            console.log(
              "myComponentInstance._data::: ",
              myComponentInstance._data
            );
            myComponentInstance._data.Content = decodeURI(unicodeStringURI); // 注意：这里使用了私有属性 _data
            myComponentInstance.$forceUpdate();
          } else {
            console.error("MyChildComponent not found.");
          }
          button.click();
        });
      }
    });
  }
})();
