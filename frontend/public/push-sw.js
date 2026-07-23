self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {};
  }
  const title = data.title || "Arvexo Arena";
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || "У тебя новое уведомление.",
      tag: data.tag || "arvexo-notification",
      data: { href: data.href || "/app/dashboard" },
      badge: "/logo-concepts/arvexo-02-arena-icon.svg",
      icon: "/logo-concepts/arvexo-02-arena-icon.svg",
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const href = event.notification.data?.href || "/app/dashboard";
  const target = new URL(href, self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const openClient = clients.find((client) => client.url.startsWith(self.location.origin));
      if (openClient) {
        return openClient.focus().then(() => openClient.navigate(target));
      }
      return self.clients.openWindow(target);
    }),
  );
});
