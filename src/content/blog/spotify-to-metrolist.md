---
title: "I Moved 56 Playlists Off Spotify to Take My Music Back"
date: 2026-08-19
tags: ["Essay", "Python", "Music", "Claude Code"]
---

For a long time I told myself Spotify was making my life easier. One app, every song, a recommendation engine that always had something ready. At some point I realized it wasn't easing anything. It was quietly reshaping how I listened.

This is the story of why I left, what I built to get out, and how I did the whole thing with Claude Code sitting next to me.

*This project is featured on my [Projects](/projects) page, with the code and a short breakdown.*

## The part I don't usually admit

Spotify turned music into a feed.

I stopped choosing albums. I stopped sitting with a record long enough to actually know it. Instead I skipped. If a song didn't grab me in ten seconds, next. The Discover Weekly, the autoplay, the endless radio after a playlist ended — it all trained me to treat music the way I treat everything else on a screen. Consume, react, move on.

The tell was the skipping. I'd add a song I loved to a playlist and then skip past it two weeks later because my thumb was bored. I wasn't listening to music anymore. I was scrolling it. It had the same shape as every other app that's designed to keep you tapping, and it worked on me.

I didn't want a detox week. I wanted the machine that made me behave that way out of my daily life. That meant leaving the platform, not just muting a feature.

## Why Metrolist

I use Android, and I landed on Metrolist, a clean YouTube Music client. No ads shoved in, no algorithmic pressure to keep me moving, no feed pulling my attention sideways. It plays what I tell it to play. That was the whole point. I wanted an app that treats a playlist as a thing I made, not a launchpad into an infinite queue someone else designed.

The catch: all my music history lived in Spotify. 56 playlists. Thousands of songs I'd collected over years. I wasn't going to rebuild that by hand.

So I decided to move it myself, with code.

## What I actually built (the half-technical version)

The idea sounds simple and mostly is, once you see the shape of it.

> The full project is open source → **[github.com/MehmetKorkut/spotify-to-metrolist](https://github.com/MehmetKorkut/spotify-to-metrolist)**

Metrolist doesn't have an "import from Spotify" button, and it isn't supposed to. It's a YouTube Music client, so it shows whatever playlists live in your YouTube Music account. That gave me the bridge: if I could recreate my Spotify playlists inside YouTube Music, Metrolist would just pick them up automatically.

So the migration is really three moves:

<figure style="margin:1.75rem 0;">
<svg viewBox="0 0 360 520" role="img" aria-label="Migration pipeline: a Python script reads my 56 Spotify playlists via the Spotify API, searches and best-matches each track on YouTube Music, creates the matched playlists in my YouTube Music account, and they appear automatically in Metrolist once it signs into the same Google account." style="display:block;width:100%;max-width:340px;margin:0 auto;font-family:'Lora',Georgia,serif;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="pl-arrow" markerWidth="9" markerHeight="9" refX="6" refY="4" orient="auto">
      <path d="M1,1 L6,4 L1,7" fill="none" stroke="var(--color-charcoal)" stroke-opacity="0.4" stroke-width="1.3"/>
    </marker>
  </defs>

  <!-- 1 · Spotify -->
  <rect x="30" y="8" width="300" height="64" rx="8" fill="var(--color-paper)" stroke="var(--color-charcoal)" stroke-opacity="0.15"/>
  <text x="180" y="34" text-anchor="middle" font-size="14" font-weight="600" fill="var(--color-charcoal)">🎵 Spotify</text>
  <text x="180" y="54" text-anchor="middle" font-size="11" font-family="'Inter',sans-serif" fill="var(--color-charcoal)" fill-opacity="0.55">my 56 playlists</text>
  <text x="180" y="92" text-anchor="middle" font-size="10" font-weight="600" font-family="'Inter',sans-serif" fill="var(--color-rust)">1 · read via Spotify API</text>
  <line x1="180" y1="98" x2="180" y2="116" stroke="var(--color-charcoal)" stroke-opacity="0.4" stroke-width="1.3" marker-end="url(#pl-arrow)"/>

  <!-- 2 · Python -->
  <rect x="30" y="118" width="300" height="64" rx="8" fill="var(--color-paper)" stroke="var(--color-charcoal)" stroke-opacity="0.15"/>
  <text x="180" y="144" text-anchor="middle" font-size="14" font-weight="600" fill="var(--color-charcoal)">🐍 Python script</text>
  <text x="180" y="164" text-anchor="middle" font-size="11" font-family="'Inter',sans-serif" fill="var(--color-charcoal)" fill-opacity="0.55">title · artist · album</text>
  <text x="180" y="202" text-anchor="middle" font-size="10" font-weight="600" font-family="'Inter',sans-serif" fill="var(--color-rust)">2 · search &amp; best-match</text>
  <line x1="180" y1="208" x2="180" y2="226" stroke="var(--color-charcoal)" stroke-opacity="0.4" stroke-width="1.3" marker-end="url(#pl-arrow)"/>

  <!-- 3 · YouTube Music search -->
  <rect x="30" y="228" width="300" height="64" rx="8" fill="var(--color-paper)" stroke="var(--color-charcoal)" stroke-opacity="0.15"/>
  <text x="180" y="254" text-anchor="middle" font-size="14" font-weight="600" fill="var(--color-charcoal)">🔎 YouTube Music</text>
  <text x="180" y="274" text-anchor="middle" font-size="11" font-family="'Inter',sans-serif" fill="var(--color-charcoal)" fill-opacity="0.55">find the video for each track</text>
  <text x="180" y="312" text-anchor="middle" font-size="10" font-weight="600" font-family="'Inter',sans-serif" fill="var(--color-rust)">3 · create playlist</text>
  <line x1="180" y1="318" x2="180" y2="336" stroke="var(--color-charcoal)" stroke-opacity="0.4" stroke-width="1.3" marker-end="url(#pl-arrow)"/>

  <!-- 4 · YouTube Music account -->
  <rect x="30" y="338" width="300" height="64" rx="8" fill="var(--color-paper)" stroke="var(--color-charcoal)" stroke-opacity="0.15"/>
  <text x="180" y="364" text-anchor="middle" font-size="14" font-weight="600" fill="var(--color-charcoal)">📺 YouTube Music account</text>
  <text x="180" y="384" text-anchor="middle" font-size="11" font-family="'Inter',sans-serif" fill="var(--color-charcoal)" fill-opacity="0.55">my library</text>
  <text x="180" y="422" text-anchor="middle" font-size="10" font-weight="600" font-family="'Inter',sans-serif" fill="var(--color-forest)">signs into same Google account</text>
  <line x1="180" y1="428" x2="180" y2="446" stroke="var(--color-charcoal)" stroke-opacity="0.4" stroke-width="1.3" marker-end="url(#pl-arrow)"/>

  <!-- 5 · Metrolist -->
  <rect x="30" y="448" width="300" height="64" rx="8" fill="var(--color-forest)" fill-opacity="0.08" stroke="var(--color-forest)" stroke-opacity="0.35"/>
  <text x="180" y="474" text-anchor="middle" font-size="14" font-weight="600" fill="var(--color-charcoal)">📱 Metrolist</text>
  <text x="180" y="494" text-anchor="middle" font-size="11" font-family="'Inter',sans-serif" fill="var(--color-charcoal)" fill-opacity="0.55">playlists just appear</text>
</svg>
<figcaption style="text-align:center;font-size:0.8rem;font-style:italic;opacity:0.55;margin-top:0.5rem;">The three-move migration pipeline.</figcaption>
</figure>

1. **Read my playlists out of Spotify.** Spotify has an official API. With the right credentials, a script can log in as me and pull every playlist and every track — the title, the artist, the album.

2. **Find each song on YouTube Music.** This is the fuzzy part. Spotify and YouTube Music are different catalogs with different naming. So for each Spotify track, the script searches YouTube Music and picks the best match, leaning on things like "is this an actual song result" and "is the length about the same." Most of the time the top hit is obviously right.

3. **Create the playlist in my YouTube Music account.** Once the script has the list of matched songs, it builds a new playlist and drops them in.

Then I open Metrolist, sign into the same account, and everything is there.

Under the hood it's Python. One piece talks to Spotify, another talks to YouTube Music, and a third orchestrates the whole thing: go through each playlist, match the songs, build the new playlist, keep a log of anything it couldn't find. Nothing exotic. The interesting engineering wasn't the happy path. It was everything that went wrong.

## The wall: YouTube didn't want me doing this quickly

The Spotify side behaved. The YouTube Music side fought me for hours, and honestly that turned into the most interesting part of the project.

First, the "proper" way to log a script into YouTube Music — the official token flow — simply didn't work. Every call came back rejected. After enough dead ends, the workaround was to authenticate the way a browser does, by handing the script the same session my logged-in browser uses. That worked.

Then came the real problem. I have a lot of music, and creating dozens of playlists with thousands of songs in a short window looks, to YouTube, exactly like abuse. About halfway through the first big run, it slammed the door. Writes started failing. My session would authenticate for a couple of minutes and then get quietly downgraded to a logged-out state, even though my actual browser was still perfectly logged in. YouTube had flagged the automated activity and was throttling it on purpose.

That could have been where the project died. Instead it forced a smarter design.

The key insight was that **searching for songs is public** — it doesn't need a logged-in account — but **creating playlists does**. So I split the job in two:

- **Phase one: do all the slow, safe work first.** Search for every single song and save the matches to a file. Thousands of lookups, no account writes, nothing YouTube could object to. This built up a complete map of "Spotify song → YouTube song" that I could reuse.

- **Phase two: wait for the block to cool off, then write fast.** Once every match was already cached, recreating the playlists was quick — no searching, just building. A short burst of writes right after refreshing my session, straight from the cache, slipped in under YouTube's patience.

I also made the whole thing resumable. It kept a checkpoint of which playlists were done, so any crash or block just meant picking up where it left off, with no duplicates and no lost work. That mattered, because it crashed and got blocked more than once before it finished.

## Doing this with Claude Code

I'm comfortable with computers, but I did not write this project alone, and I'm not going to pretend I did. I built it in a back-and-forth with Claude Code, and the way that collaboration actually went is worth describing honestly.

It was not "type a prompt, get a finished program." It was closer to working with a very fast, very patient engineer who could also do the typing.

Here's what that looked like in practice:

- **It set up the scaffolding.** The Spotify client, the YouTube Music client, the main script — Claude wrote the first versions and explained what each part did.

- **It walked me through the boring-but-critical setup.** Registering the Spotify app, filling in the right fields, getting API credentials, sorting out the YouTube Music login. Step by step, and when I pasted the wrong thing into the wrong place, it caught it and fixed it.

- **It debugged in real time.** When a run crashed, Claude read the error, figured out the cause, and patched the code. Spotify quietly changed the shape of its data and my script broke — Claude spotted that the song information had moved to a different field and fixed the parser. When the first playlist came back empty, it dug into the raw response to see why instead of guessing.

- **It navigated the YouTube block with me.** This is where it earned its keep. The failed login flow, the switch to browser-based authentication, the throttling, the sessions dying after two minutes — Claude worked through each one, tested theories, and eventually landed on the two-phase, cache-everything-first strategy that got it across the line. It even read the library's own source code to understand exactly why my session kept expiring.

- **It knew when to stop and ask me.** A few times it paused: run one test playlist first before doing all 56? Try the risky write now or wait for the block to clear? Those were my calls to make, and it teed them up cleanly instead of barreling ahead.

The division of labor felt right. I brought the intent, the judgment, and the account nobody else should touch. It brought the speed, the memory of every detail, and the willingness to try the next thing at 1 a.m. without getting frustrated. When YouTube threw up a wall, I didn't have to go read forum threads for an hour. We just adapted and kept moving.

What I appreciated most is that it didn't oversell. When writes were failing, it told me plainly that pushing harder would probably make the block worse, and that waiting a few hours was the honest move. It was right.

## The result

56 out of 56 playlists moved. Around 4,370 of 4,387 songs made it across — over 99 percent. The handful that didn't match were obscure or oddly titled tracks, and the script handed me a tidy list of exactly which ones so I could add them by hand.

Now I open Metrolist and I see my music. Just my playlists, the ones I built, without a feed trying to yank me somewhere else. No autoplay quietly deciding what's next. No recommendation nudging me to skip. If I want to sit with an album, I sit with an album.

It's a small change on paper and a big one in practice. I'm listening again instead of scrolling. That was the entire goal, and it worked.

## If you're thinking about doing the same

You don't need to be a developer to want your music out of a system that's optimizing for your attention instead of your enjoyment. The technical path exists, and with a tool like Claude Code the gap between "I wish I could" and "I did" is a lot smaller than it used to be.

The catch worth knowing up front: moving thousands of songs at once looks like abuse to the platforms, so patience beats brute force. Do the safe work first, don't rush the part that gets you throttled, and keep everything resumable so a setback costs you minutes, not the whole project.

Mostly, though, I'd say this: if an app has quietly changed how you do something you love, that's reason enough to change the app. I'm glad I did.
