export default function mergeStyles(styles: any, classes: string) {
  const classNames = classes.split(' ');
  if (classNames.length < 1) {
    return "";
  }

  return classNames.reduce((text, current) => {
    return text + ' ' + styles[current];
  }, '');
}