self.addEventListener("push", (event) => {
    if (!event.data) {
        console.log("Push event but no data");
        return;
    }

    const data = event.data.json();
    console.log("[sw.js] v2 - Push received", data);

    //const title = `${data.symbol}/${data.timeframe} - ${data.last_signal} (${data.signal_reason})`;
    const title = `${data.last_signal} ${data.symbol}/${data.timeframe} (${data.market})`;
    const body = `TP: ${data.take_profit} / SL: ${data.stop_loss}\nReason: ${data.signal_reason}`;
    const deepLink = `https://jerry-crypto-app.github.io/jerry-app/#/details?cryptopair=${data.symbol}&market=${data.market}&timeframe=${data.timeframe}`;
    const icon = data.icon;

    // Show notification
    self.registration.showNotification(title, {
    body,
    icon,
    data: { deepLink },
    actions: [
        { action: "open", title: "View Details" },
        { action: "dismiss", title: "Dismiss" }
    ]
    });

    self.addEventListener("notificationclick", (event) => {
        event.notification.close();
        if (event.action === "open") {
            clients.openWindow(event.notification.data.deepLink);
        }
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
