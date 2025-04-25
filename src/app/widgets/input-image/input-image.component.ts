import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-image',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './input-image.component.html',
  styleUrls: ['./input-image.component.css']
})
export class InputImageComponent {
  @Output() photoChange = new EventEmitter<File>(); // ahora emite File
  @Input() previewUrl: string | null = null;
  editForm;

  constructor(private fb: UntypedFormBuilder) {

    this.editForm = this.fb.group({
      photo: []
    });
  }

  setFileData(event: Event): void {
    const eventTarget = event.target as HTMLInputElement;
    if (eventTarget?.files?.[0]) {
      const file: File = eventTarget.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);

      this.editForm.get('photo')?.setValue(file);
      this.photoChange.emit(file);
    }
  }

  clearImage(input: HTMLInputElement): void {
    input.value = '';
    this.editForm.get('photo')?.setValue(null);
    this.previewUrl = null;
  }
}
