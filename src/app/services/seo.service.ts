import { inject, Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { SeoData } from '../models/SEO/SeoData.model';
import { SeoAlbumData } from '../models/SEO/Music/SeoAlbumData.model';
import { SeoPlaylistData } from '../models/SEO/Music/SeoPlaylistData.model';
import { environment } from '../../environments/environment';

interface ImageParams {
    width: number;
    height: number;
    format: 'jpg' | 'png' | 'webp';
    fit: 'clip' | 'crop' | 'fill' | 'facearea' | 'fit' | 'scale';
}

/*
 Open Graph image requirements:
 - size: 1200x630
 - format: jpg or png
*/
export const OG_IMAGE_PARAMS: ImageParams = {
    width: 1200,
    height: 630,
    format: 'jpg',
    fit: 'crop',
};

@Injectable({ providedIn: 'root' })
export class SeoService {
    private readonly _metaService = inject(Meta);

    setSeoData(seoData: SeoData): void {
        const title = seoData.title
            ? `${seoData.title} | TuneSync`
            : 'TuneSync';

        this._updateMetaTag('og:locale', 'en_US');
        this._updateMetaTag('og:site_name', 'TuneSync');
        this._updateMetaTag('og:title', title);
        this._updateMetaTag('og:description', seoData.description);
        this._updateMetaTag('og:audio', seoData.ogAudio);

        this._updateMetaTag(
            'og:image',
            this._getImageParamsUrl(seoData.ogImage?.url, OG_IMAGE_PARAMS)
        );
        this._updateMetaTag('og:image:width', '1200');
        this._updateMetaTag('og:image:height', '630');
        this._updateMetaTag('og:image:type', 'image/jpeg');
        this._updateMetaTag('og:image:alt', seoData.ogImage?.alt);
        this._updateMetaTag('og:url', seoData.ogUrl);
        this._updateMetaTag('og:type', seoData.ogType);
    }

    setAlbumSeoData(albumSeoData: SeoAlbumData): void {
        this._updateMetaTag('music:album:track', albumSeoData.tracksCount?.toString());
        this._updateMetaTag('music:album:musician', albumSeoData.musician);
    }

    setPlaylistSeoData(playlistSeoData: SeoPlaylistData): void {
        this._updateMetaTag('music:album:track', playlistSeoData.tracksCount?.toString());
        this._updateMetaTag('music:album:musician', playlistSeoData.creator);
    }

    private _updateMetaTag(name: string, content?: string): void {
        if (!content) {
            this._metaService.removeTag(`property="${name}"`);
            return;
        }

        if (this._metaService.getTag(`property="${name}"`)) {
            this._metaService.updateTag({ property: name, content });
        } else {
            this._metaService.addTag({ property: name, content });
        }
    }

    private _getImageParamsUrl(
        imageUrl: string | undefined,
        imageParams: ImageParams
    ): string {
        const fallback = environment.selfUrl + '/assets/images/10563.jpg';

        let finalUrl = imageUrl ?? fallback;

        try {
            const url = new URL(finalUrl);
            url.search = '';
            url.searchParams.set('w', imageParams.width.toString());
            url.searchParams.set('h', imageParams.height.toString());
            url.searchParams.set('fm', imageParams.format);
            url.searchParams.set('fit', imageParams.fit);

            return url.toString();
        } catch {
            // If URL is completely invalid, fallback
            const url = new URL(fallback);
            url.search = '';
            url.searchParams.set('w', imageParams.width.toString());
            url.searchParams.set('h', imageParams.height.toString());
            url.searchParams.set('fm', imageParams.format);
            url.searchParams.set('fit', imageParams.fit);

            return url.toString();
        }
    }
}