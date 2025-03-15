self.addEventListener("push", (event) => {
  if (!event.data) {
      console.log("Push event but no data");
      return;
  }

  const data = event.data.json();
  console.log("[sw.js] - Push received", data);

  const title = `${data.symbol}/${data.timeframe} - ${data.last_signal}`;
  const body = `TP: ${data.takeProfit} / SL: ${data.stopLoss}`;
  const deepLink = `/details?cryptopair=${data.symbol}&market=${data.market}&timeframe=${data.timeframe}`;
  const icon = data.icon;

  // Show notification
  self.registration.showNotification(title, {
      body: body,
      icon: icon,
      data: deepLink,
  });

  // Send data to the React app (if open)
  self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      clients.forEach((client) => {
          client.postMessage(data);
      });
  });
});


self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data.url;

  if (url) {
      event.waitUntil(clients.openWindow(url));
  }
});
