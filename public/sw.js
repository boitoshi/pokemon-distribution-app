// Service Worker for 配信ポケモン検索データベース
const CACHE_NAME = 'pokemon-distribution-v1';
const BASE_PATH = '/distribution';

// キャッシュするファイル
const STATIC_ASSETS = [
    `${BASE_PATH}/`,
    `${BASE_PATH}/index.html`,
    `${BASE_PATH}/pokemon.json`,
    `${BASE_PATH}/manifest.json`
];

// インストール時にキャッシュ
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// 古いキャッシュの削除
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_NAME)
                        .map((name) => caches.delete(name))
                );
            })
            .then(() => self.clients.claim())
    );
});

// ネットワークファースト、フォールバックでキャッシュ
self.addEventListener('fetch', (event) => {
    // 同じオリジンのリクエストのみ処理
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // POSTリクエストは無視
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // レスポンスが有効な場合のみキャッシュ
                if (response && response.status === 200 && response.type === 'basic') {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                }
                return response;
            })
            .catch(() => {
                // オフライン時はキャッシュから
                return caches.match(event.request)
                    .then((response) => {
                        if (response) {
                            return response;
                        }
                        // キャッシュにない場合はインデックスページを返す
                        if (event.request.mode === 'navigate') {
                            return caches.match(`${BASE_PATH}/`);
                        }
                        return new Response('Offline', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});

// バックグラウンド同期（将来の拡張用）
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        event.waitUntil(
            // データ同期処理
            console.log('Background sync triggered')
        );
    }
});
