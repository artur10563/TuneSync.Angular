import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PlaylistService } from '../../services/playlist.service';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';
import { ModalConfig } from '../../models/modal.model';
import { NotificationService } from '../../services/notification.service';
import { PlaylistSummary } from '../../models/Playlist/PlaylistSummary.mode';
import { MixService } from '../../services/mix.service';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

    @Output() sidebarToggle = new EventEmitter<boolean>();
    isCollapsed = false;
    isHovered = false;

    get isExpanded(): boolean {
        return !this.isCollapsed || this.isHovered;
      }
    playlists: PlaylistSummary[] = [];

    constructor(
        private playlistService: PlaylistService,
        public authService: AuthService,
        private modalService: ModalService,
        private notificationService: NotificationService,
        public mixService: MixService) { }

    ngOnInit(): void {
        this.playlistService.playlists$.subscribe((playlists) => {
            this.playlists = playlists;
        })
        this.mixService.selectionCount$.subscribe((count) => {
            this.selectionCount = count;
        });
    }

    selectionCount: number = 0;
    selectedItems: any[] = [];

    toggleSidebar() {
        this.isCollapsed = !this.isCollapsed;
        this.sidebarToggle.emit(this.isCollapsed);
    }

    expandSidebar() {
        if (this.isCollapsed) {
            this.isHovered = true;
            this.sidebarToggle.emit(false); // Explicitly not collapsed
        }
    }
    
    collapseSidebar() {
        if (this.isHovered) {
            this.isHovered = false;
            this.sidebarToggle.emit(this.isCollapsed); // Could still be true
        }
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

    startMix() {
        this.mixService.startMix();
    }
    removeSelected() {
        this.mixService.removeItemFromSelection(this.selectedItems);
        this.selectedItems = [];
    }

    mixDialogVisible: boolean = false;
    items: MenuItem[] = [
        {
            label: 'Clear',
            command: () => {
                this.mixService.clearMix();
            }
        },
        {
            label: 'Mix managament',
            command: () => {
                this.mixDialogVisible = true;
            }
        }
    ];
}
