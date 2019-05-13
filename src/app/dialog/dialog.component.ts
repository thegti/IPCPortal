// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-dialog',
//   templateUrl: './dialog.component.html',
//   styleUrls: ['./dialog.component.scss']
// })
// export class DialogComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector   : 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls  : ['./dialog.component.scss']
})
export class DialogComponent
{
    public Message: string;
    public isError: Boolean = false;

    constructor(
        public dialogRef: MatDialogRef<DialogComponent>
    )
    {
    }

}