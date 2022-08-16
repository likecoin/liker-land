# [Liker Land](https://liker.land)
Decentralize Publishing in Web3 via Writing NFT. A DAO for content lovers.

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

## Changelog
Please read the changelog [here](CHANGELOG.md).
