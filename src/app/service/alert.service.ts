import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  successful(message: string) {
    this.alert("¡Operación exitosa!", message, 'success', '#1F8EF1', 'Aceptar', 2600);
  }
  successfulCallback(message: string, onClose: () => void = () => { }) {
    this.alertCallback("¡Operación exitosa!", message, 'success', '#1F8EF1', 'Aceptar', 2600, onClose);
  }

  error(message: string) {
    this.alert("Error", message, 'error', '#f91919', 'Aceptar', 2600);
  }

  warning(message: string) {
    this.alert("Warning", message, 'warning', '#decf22', 'Entendido');
  }

  alert(title: string, text: string, icon: SweetAlertIcon, color: string, confirmButtonText: string = 'Continuar', timer: number | undefined = undefined) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      iconColor: color,
      background: '#2E145A',
      color: '#FFFFFF',
      confirmButtonText: confirmButtonText,
      confirmButtonColor: color,
      timer: timer,
      customClass: {
        popup: 'swal2-custom-popup-success',
        title: 'swal2-custom-title',
        confirmButton: 'swal2-custom-button',
      },
      didOpen: () => {
        const popup = document.querySelector('.swal2-custom-popup-success') as HTMLElement;
        if (popup) {
          popup.style.borderRadius = '12px';
          popup.style.boxShadow = '0 0 20px ' + this.convertToRGBA(color);
        }

        const title = document.querySelector('.swal2-custom-title') as HTMLElement;
        if (title) {
          title.style.fontFamily = "'Arial', sans-serif";
          title.style.fontWeight = 'bold';
          title.style.textAlign = 'center';
        }

        const button = document.querySelector('.swal2-custom-button') as HTMLElement;
        if (button) {
          button.style.fontWeight = 'bold';
          button.style.textTransform = 'uppercase';
          button.style.borderRadius = '6px';
        }
      },
    });
  }

  alertCallback(title: string,text: string,icon: SweetAlertIcon,color: string, confirmButtonText: string = 'Continuar',timer: number = 1600, onClose: () => void = () => { } ) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      iconColor: color,
      background: '#2E145A',
      color: '#FFFFFF',
      confirmButtonText: confirmButtonText,
      confirmButtonColor: color,
      timer: timer,
      customClass: {
        popup: 'swal2-custom-popup-success',
        title: 'swal2-custom-title',
        confirmButton: 'swal2-custom-button',
      },
      didOpen: () => {
        const popup = document.querySelector('.swal2-custom-popup-success') as HTMLElement;
        if (popup) {
          popup.style.borderRadius = '12px';
          popup.style.boxShadow = '0 0 20px ' + this.convertToRGBA(color);
        }

        const titleElement = document.querySelector('.swal2-custom-title') as HTMLElement;
        if (titleElement) {
          titleElement.style.fontFamily = "'Arial', sans-serif";
          titleElement.style.fontWeight = 'bold';
          titleElement.style.textAlign = 'center';
        }

        const button = document.querySelector('.swal2-custom-button') as HTMLElement;
        if (button) {
          button.style.fontWeight = 'bold';
          button.style.textTransform = 'uppercase';
          button.style.borderRadius = '6px';
        }
      },
      willClose: () => {
        onClose();
      }
    });
  }

  private convertToRGBA(color: string): string {
    const tempElement = document.createElement("div");
    tempElement.style.color = color;
    document.body.appendChild(tempElement);

    const computedColor = getComputedStyle(tempElement).color;
    document.body.removeChild(tempElement);

    const rgbRegex = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
    const rgbaRegex = /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*([01](?:\.\d+)?)\)$/;

    if (rgbRegex.test(computedColor)) {
      const match = computedColor.match(rgbRegex);
      if (match) {
        const [_, r, g, b] = match;
        return `rgba(${r}, ${g}, ${b}, 0.5)`;
      }
    } else if (rgbaRegex.test(computedColor)) {
      const match = computedColor.match(rgbaRegex);
      if (match) {
        const [_, r, g, b] = match;
        return `rgba(${r}, ${g}, ${b}, 0.5)`;
      }
    }

    throw new Error("Invalid color format or unsupported color input.");
  }

}
