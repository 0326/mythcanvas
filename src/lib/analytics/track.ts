/**
 * 前端轻量埋点工具（M11）。
 * 提供两个可用宏：
 * - track(name, targetId?, extra?) : 立即上报一个事件
 * - trackVisibleImpressions(scope, name) : 对 scope 内的元素做 IntersectionObserver 首曝上报
 */
type TrackPayload = {
  name: string;
  targetId?: string;
  page?: string;
  extra?: Record<string, unknown>;
};

function pagePath(): string {
  return typeof window !== 'undefined' ? window.location.pathname : '';
}

export async function track(payload: TrackPayload): Promise<void> {
  try {
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: payload.name,
        targetId: payload.targetId,
        page: payload.page ?? pagePath(),
        extra: payload.extra,
      }),
      keepalive: true,
    });
  } catch {
    // 静默失败，不影响体验
  }
}

/**
 * 对给定 scope 内带 data-track 属性的元素做一次 impression 上报。
 * 元素示例：<img data-track="artwork_impression" data-track-id={artwork.id} ... />
 */
export function trackVisibleImpressions(scope = document): void {
  const els = Array.from(scope.querySelectorAll<HTMLElement>('[data-track]'));
  if (els.length === 0) return;
  if (typeof IntersectionObserver === 'undefined') {
    els.forEach((el) => send(el));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        send(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '100px' });
  els.forEach((el) => observer.observe(el));

  function send(el: HTMLElement) {
    const name = el.dataset.track;
    if (name) {
      void track({ name, targetId: el.dataset.trackId });
    }
  }
}

// 页面级公共事件（下载、收藏已由各自 API 记录；这里是额外的发现/点击埋点）
export function trackClick(name: string, targetId?: string): void {
  void track({ name, targetId });
}