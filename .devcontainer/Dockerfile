FROM mcr.microsoft.com/devcontainers/typescript-node:18

# 必要なグローバルパッケージをインストール
RUN npm install -g @nuxt/cli pnpm

# 作業ディレクトリを設定
WORKDIR /workspace

# タイムゾーンを東京に設定
ENV TZ=Asia/Tokyo

# zshを使う場合のテーマ設定
RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v1.1.2/zsh-in-docker.sh)" -- \
    -t robbyrussell \
    -p git \
    -p https://github.com/zsh-users/zsh-autosuggestions \
    -p https://github.com/zsh-users/zsh-syntax-highlighting

# コンテナユーザーを設定
USER node

# エイリアスを追加（オプション）
RUN echo 'alias nuxi="npx nuxi"' >> ~/.zshrc
RUN echo 'alias dev="npm run dev"' >> ~/.zshrc
