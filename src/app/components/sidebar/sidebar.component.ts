import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PlaylistService } from '../../services/playlist.service';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';
import { ModalConfig } from '../../models/modal.model';
import { NotificationService } from '../../services/notification.service';
import { PlaylistSummary } from '../../models/Playlist/PlaylistSummary.mode';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

    @Output() sidebarToggle = new EventEmitter<boolean>();
    isCollapsed = false;
    playlists: PlaylistSummary[] = [];

    constructor(
        private playlistService: PlaylistService,
        public authService: AuthService,
        private modalService: ModalService,
        private notificationService: NotificationService) { }

    ngOnInit(): void {
        this.playlistService.playlists$.subscribe((playlists) => {
            this.playlists = playlists;
        })
    }


    toggleSidebar() {
        this.isCollapsed = !this.isCollapsed;
        this.sidebarToggle.emit(this.isCollapsed);
    }

    createNewPlaylistModal() {
        const config: ModalConfig = {
            title: 'Create new Playlist',
            confirmButtonText: 'Create',
            cancelButtonText: 'Cancel',
            fields: [
                {
                    type: 'text',
                    name: 'title',
                    label: '',
                    required: true,
                    placeholder: 'Enter playlist title',
                }
            ]
        };

        this.modalService.openGenericModal(config).then((result: { title: string }) => {
            this.playlistService.createPlaylist(result.title);
        });
    }
}
