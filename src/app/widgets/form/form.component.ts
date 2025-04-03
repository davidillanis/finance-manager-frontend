import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';

import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {
  items: string[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { items: string[] }) {
    this.items = data.items;
  }


}
