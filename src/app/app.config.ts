import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const iniciar={"projectId":"finance-manager-f8aaf","appId":"1:404536286475:web:cf592cf27e448ef04fd60e","storageBucket":"finance-manager-f8aaf.firebasestorage.app","apiKey":"AIzaSyD-LvqB24bz_QWm0dMRSklzB14a-0IgO3E","authDomain":"finance-manager-f8aaf.firebaseapp.com","messagingSenderId":"404536286475","measurementId":"G-NPTQDH7LWG"}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()), provideFirebaseApp(() => initializeApp(iniciar)), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),
    { provide: FIREBASE_OPTIONS, useValue: iniciar }, provideAnimationsAsync(), provideFirebaseApp(() => initializeApp({"projectId":"finance-manager-f8aaf","appId":"1:404536286475:web:cf592cf27e448ef04fd60e","storageBucket":"finance-manager-f8aaf.firebasestorage.app","apiKey":"AIzaSyD-LvqB24bz_QWm0dMRSklzB14a-0IgO3E","authDomain":"finance-manager-f8aaf.firebaseapp.com","messagingSenderId":"404536286475","measurementId":"G-NPTQDH7LWG"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),
  ]
};
