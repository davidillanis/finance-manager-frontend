import { Component } from '@angular/core';
import { InputImageComponent } from "../../widgets/input-image/input-image.component";
import { FileService } from '../../service/file.service';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [InputImageComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent {
  image:File | undefined;

  constructor(
    private fileService:FileService
  ){}

  onPhotoChange($event: File) {
    this.image=$event;

  }

  uploadImage(){
    if(this.image!=undefined){
      console.log(this.fileService.uploadFile2(this.image).url$.subscribe(url=> console.log(url)));
    }
  }
}
