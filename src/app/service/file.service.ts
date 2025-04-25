import { Injectable, inject } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private storage: Storage = inject(Storage);

  uploadFile2(file: File): { progress$: Observable<number>, url$: Observable<string> } {

    const filePath = `archivos/${file.name}`;
    const fileRef = ref(this.storage, filePath);
    const uploadTask = uploadBytesResumable(fileRef, file);

    const progressSubject = new Subject<number>();
    const urlSubject = new Subject<string>();

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progressSubject.next(progress);
      },
      (error) => {
        console.error('Error al subir el archivo:', error);
        progressSubject.error(error);
        urlSubject.error(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(fileRef);
        progressSubject.complete();
        urlSubject.next(downloadURL);
        urlSubject.complete();
      }
    );

    return {
      progress$: progressSubject.asObservable(),
      url$: urlSubject.asObservable()
    };
  }
}
