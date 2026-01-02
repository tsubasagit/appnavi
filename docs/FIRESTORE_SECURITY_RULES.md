# Firestore セキュリティルールについて

## 概要

このプロジェクトには2つのセキュリティルールファイルがあります：

1. **`firestore.rules`** - 開発環境用（移行用の一時的な緩和ルールを含む）
2. **`firestore.rules.production`** - 本番環境用（厳格なセキュリティルール）

## セキュリティルールの公開について

### OSSとして公開する場合の注意事項

**セキュリティルールファイル自体を公開しても、直接的なセキュリティリスクはありません。** 理由：

1. セキュリティルールはFirebaseプロジェクトにデプロイされる必要がある
2. ルールファイルだけでは、実際のデータベースにアクセスできない
3. ルールは認証情報（APIキー、認証トークンなど）を含まない

**ただし、以下の点に注意が必要です：**

1. **移行用の一時的な緩和ルール**
   - `firestore.rules`には、`ownerId`がない既存アプリへのアクセスを許可する移行用のルールが含まれています
   - **本番環境では絶対に使用しないでください**
   - 本番環境では`firestore.rules.production`を使用してください

2. **ルールの構造の公開**
   - ルールの構造が公開されることで、攻撃者がルールの弱点を探す可能性があります
   - しかし、適切に設計されたルールであれば、公開しても問題ありません

3. **プロジェクト構造の公開**
   - コレクション名やデータ構造が公開されます
   - これは一般的に問題ありませんが、機密性の高い情報が含まれる場合は注意が必要です

## 使用方法

### 開発環境

開発環境では、移行用の緩和ルールを含む`firestore.rules`を使用します：

```bash
# Firebase CLIでデプロイ
firebase deploy --only firestore:rules
```

### 本番環境

本番環境では、厳格なセキュリティルールを含む`firestore.rules.production`を使用します：

```bash
# 本番環境用のルールをデプロイ
firebase deploy --only firestore:rules --project your-production-project-id
```

または、Firebase Consoleで直接`firestore.rules.production`の内容をコピー＆ペーストしてください。

## 移行用ルールの削除

移行が完了したら、以下の手順で移行用ルールを削除してください：

1. すべてのアプリに`ownerId`が設定されていることを確認
2. `firestore.rules.production`の内容を`firestore.rules`にコピー
3. Firebase Consoleでルールを更新

## セキュリティチェックリスト

本番環境にデプロイする前に確認：

- [ ] `firestore.rules.production`を使用している
- [ ] 移行用の緩和ルール（`!resource.data.ownerId`）が含まれていない
- [ ] すべてのアプリに`ownerId`が設定されている
- [ ] 組織メンバーシップのチェックが正しく機能している
- [ ] 管理者権限のチェックが正しく機能している

## 参考資料

- [Firestore セキュリティルール](https://firebase.google.com/docs/firestore/security/get-started)
- [セキュリティルールのベストプラクティス](https://firebase.google.com/docs/firestore/security/rules-conditions)


