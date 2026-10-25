const fn通知 = (内容: string, 类型: boolean) => {
  if (ElMessage) {
    ElMessage[类型 ? "success" : "error"](内容);
  }
};

/**
 * 向剪贴板写入文本内容（现代API + 传统降级兼容）
 * @param {string} 写入内容 - 需要复制到剪贴板的文本内容
 * @returns {Promise<void>} 复制成功时 resolve，失败时 reject
 * @throws {Error} 复制过程中发生错误时抛出异常
 */
export async function fn剪切板写入(写入内容: string): Promise<void> {
  if (!写入内容.trim()) {
    console.log("开始向剪切板写入内容，内容为空，跳过！");
    return;
  }
  console.log("开始向剪切板写入内容", 写入内容);

  // 检测是否支持 navigator.clipboard.writeText
  if (navigator.clipboard && window.isSecureContext) {
    // 使用现代 Clipboard API
    try {
      await navigator.clipboard.writeText(写入内容);
      console.log("使用现代 Clipboard API 已复制到剪贴板");
      fn通知("复制成功", true);
      return; // 成功时返回
    } catch (error) {
      console.error("使用现代 Clipboard API 复制失败:", error);
      fn通知("复制失败", false);
      throw error; // 失败时抛出错误
    }
  } else {
    // 使用传统方法作为降级方案
    return new Promise((resolve, reject) => {
      const textArea = document.createElement("textarea");
      try {
        textArea.value = 写入内容;

        // 隐藏元素
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        textArea.style.opacity = "0";
        textArea.style.pointerEvents = "none";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        // 执行复制命令
        const successful = document.execCommand("copy");

        // 清理临时元素
        document.body.removeChild(textArea);

        if (successful) {
          console.log("使用传统方法作为降级方案 已复制到剪贴板");
          fn通知("复制成功-传统", true);
          resolve(); // 成功时 resolve
        } else {
          console.error("复制失败-传统");
          fn通知("复制失败", false);
          reject(new Error("使用传统方法作为降级方案 复制命令执行失败"));
        }
      } catch (error) {
        console.error("复制失败:", error);
        fn通知("复制失败-传统", false);
        // 确保清理元素
        if (document.body.contains(textArea)) {
          document.body.removeChild(textArea);
        }
        reject(error); // 失败时 reject
      }
    });
  }
}

declare global {
  // 让 编辑器识别全局函数
  function fn剪切板写入(txt: string): Promise<void>;
}

// 挂载到全局 TypeScript 类型声明
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    fn剪切板写入: typeof fn剪切板写入;
  }
}
