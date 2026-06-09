## Summary

-

## Scope

- [ ] CLI
- [ ] Web dashboard
- [ ] Core runner/scoring
- [ ] Test packs
- [ ] Adapters
- [ ] Database/persistence
- [ ] Docs/polish

## Safety Checklist

- [ ] Changes remain defensive and synthetic.
- [ ] No real credentials, secrets, malware, phishing, or third-party attack instructions were added.
- [ ] Tool calls remain dry-run or explicitly non-destructive.
- [ ] External AI/provider calls are not enabled by default.
- [ ] Raw database or stack-trace errors are not exposed to users.

## Verification

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Notes

-
