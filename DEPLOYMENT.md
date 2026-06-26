# GitHub Pages Deployment

このリポジトリはRenderのExpress APIを使わず、GitHub ActionsでAPIデータを静的JSONに変換してGitHub Pagesへ配信します。

## GitHub側の設定

1. リポジトリの `Settings` → `Secrets and variables` → `Actions` を開く
2. `Repository secrets` に以下を追加する
   - `HOTPEPPER_API_KEY`
   - `OPENTRIP_API_KEY`
3. `Settings` → `Pages` を開く
4. `Build and deployment` の `Source` を `GitHub Actions` にする

## デプロイの流れ

`.github/workflows/pages.yml` が以下を行います。

1. npm依存関係をインストール
2. `npm run fetch:data` でHotPepper/OpenTripMapから `client/public/data/*.json` を生成
3. Reactをビルド
4. `client/build` をGitHub Pagesへデプロイ

`main` または `master` へのpush、手動実行、毎日03:00（JST）の定期実行で更新されます。
