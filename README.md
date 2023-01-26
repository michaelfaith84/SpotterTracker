# Spotter Tracker

        A simple mobile app for getting or tracking your location



#### Definitions

- Spot: A single point.
- Track: A collection of related points.

---

#### What makes Spotter Tracker different?

- Dead simple, one button interface.
- With one click you can save your current location or start recording a track.
- Easily copy the coordinates of your spot's to the clipboard for immediate use.
- Easily export spots or tracks to geojson.
- As soon as coordinates are received, they're saved to your phone--if your phone's battery dies mid-recording, you don't lose any data!

---
#### Take a Peek

<details>
  <summary>Spot and Track Creation Demo</summary>

![](https://github.com/michaelfaith84/SpotterTracker/blob/master/creation_demo.gif)
</details>

<details>
  <summary>Data Management Demo</summary>

![](https://github.com/michaelfaith84/SpotterTracker/blob/master/manage_demo.gif)
</details>

<details>
  <summary>GeoJSON Export Example</summary>

<img alt="A screen shot of an exported track in GeoJSON. It is a feature with a bounding box and a linestring. The points are longitude, latitude, and elevation." src="https://github.com/michaelfaith84/SpotterTracker/blob/master/geojson_track_example.jpg" height="150" />
</details>

---

#### Getting Started

```bash
npx expo install
npx expo start
```

Use [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US&gl=US&pli=1) to scan the QR code.

---

#### Notes

- The app is done enough for testing but not quite there yet.
- Only works on Android at the moment.
  - Tested on the Pixel 6 Pro running Android 13