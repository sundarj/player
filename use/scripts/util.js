export function normalisePathname( pathname ) {
  return pathname[0] === '/' ? pathname : '/' + pathname
}
