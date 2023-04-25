require('dotenv').config();

import {uploadImage} from '../src/utils/directus';
import {fetchNews} from '../src/utils/kirby';
import prismaClient from '../src/utils/prismaClient';

(async () => {
  const data = await fetchNews();

  console.log(`Fetched ${data.length} news items`);

  for (const news of data) {
    let result: RegExpExecArray | null = null;
    while ((result = /\(image: ?([^)]+)\)/gm.exec(news.content.text)) != null) {
      const image = news.files.find((file) => file.filename === result![1]);
      if (image == null) {
        continue;
      }

      // const file = await uploadImage(image.url, {
      //   folder: 'b449e035-debe-4172-a611-063106148d2b',
      // });

      news.content.text = news.content.text.replace(
        result[0],
        `![](https://crew.kulturspektakel.de/assets/${image.filename})`,
      );
    }

    while (
      (result = /\(link: ?([^) ]+)(?: text: ?([^)]+))?\)/gm.exec(
        news.content.text,
      )) != null
    ) {
      news.content.text = news.content.text.replace(
        result[0],
        `[${result[2] ?? result[1]}](${result[1]})`,
      );
    }

    while (
      (result = /\(email: ?([^) ]+)(?: text: ?([^)]+))?\)/gm.exec(
        news.content.text,
      )) != null
    ) {
      news.content.text = news.content.text.replace(
        result[0],
        `[${result[2] ?? result[1]}](mailto:${result[1]})`,
      );
    }

    news.content.text = news.content.text.replace(/\r/gm, '\n');
    news.content.text = news.content.text.replace(/(?<!\n)\n(?!\n)/gm, '  \n');
    news.content.text = news.content.text.replace(
      / *\n *(?: *\n *)+/gm,
      '\n\n',
    );
  }

  await prismaClient.$transaction([
    prismaClient.news.deleteMany(),
    prismaClient.news.createMany({
      data: data.map(({slug, content}) => ({
        slug,
        title: content.title,
        content: content.text,
        createdAt: new Date(content.date),
      })),
    }),
  ]);
})();
