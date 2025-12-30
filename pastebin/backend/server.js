import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import Paste from './models/Paste.js';
import { getNow } from './utils/time.js';
import { escapeHtml } from './utils/escapeHtml.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true,
}));


const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
console.log(DB_URL);


mongoose.connect(DB_URL )
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB error:', err);
    process.exit(1);
  });

  function availabilityQuery(now) {
  return {
    $and: [
      {
        $or: [
          { expires_at: null },
          { expires_at: { $gt: now } }
        ]
      },
      {
        $or: [
          { remaining_views: null },
          { remaining_views: { $gt: 0 } }
        ]
      }
    ]
  };
}

/* -------------------- Health Check --------------------------------------------------- */

app.get('/api/healthz', async (req, res) => {
  try {
    res.status(200).json({ ok: true });
  } catch {
    res.status(500).json({ ok: false });
  }
});

/* -------------------- Create Paste ----------------------------------------------------- */

app.post('/api/pastes', async (req, res) => {
  const { content, ttl_seconds, max_views } = req.body;

  if (!content || typeof content !== 'string' || content.trim() === '') {
    return res.status(400).json({ error: 'Invalid content' });
  }

  if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
    return res.status(400).json({ error: 'Invalid ttl_seconds' });
  }

  if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
    return res.status(400).json({ error: 'Invalid max_views' });
  }

  try {
    const paste = new Paste({
      _id: uuidv4(),
      content,
      ttl_seconds: ttl_seconds ?? null,
      max_views: max_views ?? null,
    });

    await paste.save();

    res.status(201).json({
      id: paste._id,
      url: `${req.protocol}://${req.get('host')}/p/${paste._id}`,
    });
  } catch(err) {
  res.status(500).json({ error: 'Server error', details: err.message });
  }
});

/* -------------------- Fetch Paste -------------------------------------------- */

app.get('/api/pastes/:id', async (req, res) => {
  const now = getNow(req);

  try {
    const paste = await Paste.findOne({
      _id: req.params.id,
      ...availabilityQuery(now)
    });

    if (!paste) {
      return res.status(404).json({ error: 'Not found' });
    }

    if (paste.remaining_views !== null) {
      paste.remaining_views -= 1;
      await paste.save();
    }

    res.status(200).json({
      content: paste.content,
      remaining_views: paste.remaining_views,
      expires_at: paste.expires_at,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


/* -------------------- View Paste ------------------------------------------- */

app.get('/p/:id', async (req, res) => {
  const now = getNow(req);

  try {
    const paste = await Paste.findOne({
      _id: req.params.id,
      ...availabilityQuery(now)
    });

    if (!paste) {
      return res.status(404).send('Not Found');
    }

    if (paste.remaining_views !== null) {
      paste.remaining_views -= 1;
      await paste.save();
    }

    const safeContent = escapeHtml(paste.content);

    res
      .status(200)
      .set('Content-Type', 'text/html')
      .send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Paste</title>
  <style>
    body {
      font-family: monospace;
      white-space: pre-wrap;
      padding: 20px;
    }
  </style>
</head>
<body>${safeContent}</body>
</html>`);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
