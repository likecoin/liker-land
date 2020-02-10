# [Liker Land](https://liker.land)
Where every Like is a Reward. Stories that matter, writers who think and readers who care.

## Feature
- Personalized web PWA reader
- Like and follow the reader you like

## Development

- Install npm dependencies
```bash
$ npm --prefix src install
```

- Update [config](https://github.com/likecoin/liker-land/tree/master/src/server/config) in server folder

- Run dev
```bash
$ cd src
$ npm run dev
```

## Deployment flow

- Change firebase project to yours in `.firbaserc`
```
{
  "projects": {
    "default": "(your firebase project)"
  }
}
```

- Install npm dependencies
```bash
$ npm --prefix src install
$ npm --prefix functions install
```

- Deploy everything
```bash
$ firebase deploy
```
