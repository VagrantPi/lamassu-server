### 白名單功能添加

先做 migration

```
create table whitelist (
        crypto_code text not null,
        address text not null,
        unique (crypto_code, address)
      )
```
