module 'bandcamp-scraper' {
  export interface AlbumInfo {
    artist: string;
    title: string;
    url: string;
    imageUrl?: string;
    tracks: Track[];
    tags?: Tag[];
    raw: {
      [k: string]: unknown;
    };
  }
  export interface Track {
    name: string;
    url?: string;
    duration?: string;
  }
  export interface Tag {
    name: string;
  }

  export interface AlbumProduct {
    name: string;
    artist: string;
    format: string;
    url: string;
    imageUrls: string[];
    priceInCents: null | number;
    description: string;
    soldOut: boolean;
    nameYourPrice: boolean;
    offerMore: boolean;
    currency: null | string;
  }
  export interface ArtistInfo {
    name?: string;
    location?: string;
    coverImage?: string;
    description?: string;
    albums?: Album[];
    shows?: Show[];
    bandLinks?: BandLink[];
  }
  export interface Album {
    url?: string;
    title?: string;
    coverImage?: string;
  }
  export interface Show {
    date?: string;
    venue?: string;
    venueUrl?: string;
    location?: string;
  }
  export interface BandLink {
    name?: string;
    url?: string;
  }

  export interface TagResult {
    name: string;
    artist: string;
    url: string;
    artist_url: string;
  }

  export interface TrackInfo {
    artist?: string;
    title: string;
    url: string;
    imageUrl?: string;
    trackId: number;
    raw: {
      [k: string]: unknown;
    };
  }

  export interface SearchResult {}

  type Params = {
    query: string;
    page?: number;
  };
  function search(params: Params);
}
