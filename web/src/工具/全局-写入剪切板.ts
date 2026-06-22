const fn剪切板写入成功提示 = () => {
  ElMessage.success({
    message: "复制成功",
    placement: "bottom-right",
    duration: 5000,
  });
};

const fn剪切板写入失败提示 = () => {
  ElMessage.error({
    message: "复制失败",
    placement: "bottom-right",
    duration: 5000,
  });
};

/**
 * 向剪贴板写入文本内容（现代API + 传统降级兼容）
 * @param {string} txt - 需要复制到剪贴板的文本内容
 * @returns {Promise<void>} 复制成功时 resolve，失败时 reject
 * @throws {Error} 复制过程中发生错误时抛出异常
 */
export async function fn剪切板写入(txt: string): Promise<void> {
  console.log("开始向剪切板写入内容", txt);

  // 检测是否支持 navigator.clipboard.writeText 且处于安全上下文
  if (navigator.clipboard && window.isSecureContext) {
    // 使用现代 Clipboard API
    try {
      await navigator.clipboard.writeText(txt);
      console.log("使用现代 Clipboard API 已复制到剪贴板");
      fn剪切板写入成功提示();
    } catch (error) {
      console.error("使用现代 Clipboard API 复制失败:", error);
      throw error;
    }
  } else {
    // 使用传统方法作为降级方案
    return new Promise<void>((resolve, reject) => {
      const textArea: HTMLTextAreaElement = document.createElement("textarea");
      try {
        textArea.value = txt;

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
          fn剪切板写入成功提示();
          resolve();
        } else {
          console.error("复制失败");
          reject(new Error("使用传统方法作为降级方案 复制命令执行失败"));
        }
      } catch (error) {
        console.error("复制失败:", error);
        fn剪切板写入失败提示();
        // 确保清理元素
        if (document.body.contains(textArea)) {
          document.body.removeChild(textArea);
        }
        reject(error);
      }
    });
  }
}

// 挂载到全局 TypeScript 类型声明
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $fn剪切板写入: typeof fn剪切板写入;
  }
}

(window as any).fn剪切板写入 = fn剪切板写入;
