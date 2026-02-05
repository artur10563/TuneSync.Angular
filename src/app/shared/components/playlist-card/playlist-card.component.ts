import { Component, Input, OnInit } from '@angular/core';
import { MixService } from '../../../core/services/mix.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AlbumSummary } from '../../../models/Album/AlbumSummary.model';
import { PlaylistSummary } from '../../../models/Playlist/PlaylistSummary.mode';
import { AlbumService } from '../../../services/album.service';
import { AudioService } from '../../../services/audio.service';
import { PlaylistService } from '../../../services/playlist.service';
import { AlbumSongSource, PlaylistSongSource } from '../../../services/song-sources/album-song-source';
import { SongSource } from '../../../services/song-sources/song-source.interface';


@Component({
    selector: 'app-playlist-card',
    templateUrl: './playlist-card.component.html',
    styleUrls: ['./playlist-card.component.css']
})
export class PlaylistCardComponent implements OnInit {

    constructor(private playlistService: PlaylistService,
        private albumService: AlbumService,
        private mixService: MixService,
        private audioService: AudioService,
        private notificationService: NotificationService) { }

    @Input() playlistSummary!: PlaylistSummary | AlbumSummary;
    protected songSource!: SongSource;

    ngOnInit(): void {
        this.songSource = this.isAlbum(this.playlistSummary) 
                    ? new AlbumSongSource(this.albumService, this.playlistSummary.guid)
                    : new PlaylistSongSource(this.playlistService, this.playlistSummary.guid);
    }

    toggleFavorite(playlist: PlaylistSummary | AlbumSummary) {
        if (this.isAlbum(playlist)) {
            this.albumService.toggleFavorite(playlist);
        } else {
            this.playlistService.toggleFavorite(playlist);
        }
    }

    isAlbum(playlist: PlaylistSummary | AlbumSummary): playlist is AlbumSummary {
        return (playlist as AlbumSummary).artist !== undefined;
    }

    getLink(): any[] {
        return this.isAlbum(this.playlistSummary)
            ? ['/album', this.playlistSummary.guid]
            : ['/playlist', this.playlistSummary.guid];
    }

    addToMix(playlist: PlaylistSummary | AlbumSummary) {
        this.mixService.addItemToSelection(playlist);
    }

    play() {
        this.audioService.setCurrentSongSource(this.songSource);
    }

}
