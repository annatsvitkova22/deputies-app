import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
    // tslint:disable-next-line: no-inferrable-types
    isLoader: boolean = true;

    constructor(){}

    async ngOnInit(): Promise<void> {
        this.isLoader = false;
    }

    onSave(): void {
        
    }
}
