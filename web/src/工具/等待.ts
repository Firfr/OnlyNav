/**
 * 异步等待指定秒数
 * @参数 秒 - 需要等待的时间，单位：秒
 * @返回 Promise
 */
export const fn等待 = (秒: number): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 秒 * 1000);
  });
};
