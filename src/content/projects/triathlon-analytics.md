---
title: "Memo's Multisport Analytics Interface"
description: "An interactive dashboard for my triathlon training data — swim, bike, and run sessions rendered as an explorable D3.js interface tracking volume, pace, and fitness trends over a season."
methodology: ["Interactive Data Visualization", "Time-Series Analysis", "Training Load Modeling"]
techStack: ["D3.js", "JavaScript", "Python", "Pandas"]
date: 2025-01-15
featured: true
---

A personal project visualizing a decade of triathlon training: **1,399 swim, bike, and run sessions across 22,263 km**, pulled from Strava into a single explorable D3 interface. It moves past static weekly summaries — annual volume stacked by discipline, a monthly consistency heatmap spanning 2015–2026, and year-over-year pace and speed trends.

The data is pre-aggregated at build time (no raw export ships to the browser), so refreshing it is a one-command rebuild.
