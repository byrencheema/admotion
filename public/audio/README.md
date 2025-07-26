# Audio Assets

This directory contains audio files used by the multi-agent video generation system.

## Required Audio Files

### Background Music
- `corporate-upbeat.mp3` - Professional corporate background music
- `elegant-ambient.mp3` - Luxury/premium background music  
- `modern-electronic.mp3` - Tech/app background music
- `upbeat-motivational.mp3` - Energetic marketing music
- `soft-ambient.mp3` - Calm background music

### Sound Effects
- `impact-whoosh.mp3` - Opening scene impact sound
- `transition-swoosh.mp3` - Scene transition sound effect
- `text-appear.mp3` - Text animation sound
- `final-impact.mp3` - Closing scene emphasis

## Audio Sources

You can source royalty-free audio from:
- [Freesound.org](https://freesound.org) - Creative Commons audio
- [Zapsplat](https://zapsplat.com) - Free sound effects with registration
- [Pixabay Music](https://pixabay.com/music/) - Royalty-free music
- [YouTube Audio Library](https://support.google.com/youtube/answer/3376882) - Free music and sound effects

## Usage in Remotion

Audio files are used via the `staticFile()` function:

```typescript
import { Audio, staticFile } from 'remotion';

<Audio src={staticFile('audio/corporate-upbeat.mp3')} volume={0.3} />
```

## Notes

- Keep volume levels between 0.2-0.5 to avoid overpowering the video content
- Use MP3 format for best compatibility
- File sizes should be optimized for web delivery
- Ensure you have proper licensing for any audio you use