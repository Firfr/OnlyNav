declare global {
  // 让 编辑器识别全局函数
  function fn剪切板写入(txt: string): Promise<void>;
}

export {}