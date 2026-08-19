---
title: "Spotify → Metrolist Playlist Migrator"
description: "A Python tool that moved 56 playlists — ~4,400 songs, over 99% matched — off Spotify and onto YouTube Music (for the Metrolist client). It reads the Spotify API, best-matches every track on YouTube Music, and rebuilds the playlists, using a two-phase, cache-first design to survive YouTube's rate limiting."
methodology: ["API Integration", "Fuzzy Track Matching", "Rate-Limit Engineering", "Resumable Pipelines"]
techStack: ["Python", "Spotify Web API", "YouTube Music", "ytmusicapi"]
date: 2026-08-19
featured: false
repo: "https://github.com/MehmetKorkut/spotify-to-metrolist"
post: "/blog/spotify-to-metrolist"
---

A command-line tool for leaving Spotify without losing years of curated playlists. It pulls every playlist and track from the Spotify API, searches YouTube Music for the best match per song, and recreates the playlists in a YouTube Music account — which the Metrolist app then picks up automatically.

The interesting engineering was the rate limiting: bulk playlist creation looks like abuse to YouTube, so the pipeline splits into a public, no-auth search phase that caches every match, followed by a short authenticated write burst — and checkpoints its progress so a block or crash only costs minutes.
