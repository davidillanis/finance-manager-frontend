import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verifica si el usuario está autenticado
  const user = authService.isLoggedIn

  if (user) {
    router.navigate(['/user']);

    return false;
  } else {
    return true;
  }
};
