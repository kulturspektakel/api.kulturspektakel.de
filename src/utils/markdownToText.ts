import {marked} from 'marked';

export function markdownToText(markdown: string) {
  return marked.use({
    renderer: {
      list: (list) =>
        list.items
          .map(
            (item, i) =>
              `${list.ordered ? `${i + 1 + (list.start || 0)}.` : '-'} ${item.text}`,
          )
          .join('\n'),
      listitem: () => '',
      paragraph: ({text}) => `\n${text}\n`,
      text: ({text}) => text,
      link: ({href, text}) => `${text} (${href})`,
    },
  })(markdown) as string;
}
