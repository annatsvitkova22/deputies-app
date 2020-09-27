import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { LoadedFile } from '../../models';

@Component({
    selector: 'app-uploaded-file',
    templateUrl: './uploaded-file.component.html',
    styleUrls: ['./uploaded-file.component.scss']
})
export class UploadedFileComponent {
    @Input() file: LoadedFile;
    @Output() deleteFileName = new EventEmitter<string>();
    constructor(){}

    onDelete(name: string): void {
        this.deleteFileName.emit(name);
    }
}
