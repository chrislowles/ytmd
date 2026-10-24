# ytmd
An intentionally basic, unofficial YouTube Music client.

# Feature Set (Or at least feature set I hope this ends up having)
1. Background Play - You can close it the background and continue to listen to the music.
2. Intentionally Minimal Footprint - This really supposed to just be a shortcut to YTM without needing a whole browser
3. MPRIS Support - Media Keys do what you expect

## Install (Flatpak)
Download the `.flatpak` from the latest release, then:
```sh
flatpak install --user ./ytmd-*.flatpak
flatpak run com.chrislowles.ytmd
```