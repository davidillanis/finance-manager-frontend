import { Injectable } from '@angular/core';
import { BillsEntity } from '../model/bills-entity';
import Swal from 'sweetalert2';
import { AppUtils } from '../util/other/app-utils';
import { DebtsEntity } from '../model/debts-entity';
import { IncomeEntity } from '../model/income-entity';
import { SavingsEntity } from '../model/savings-entity';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }

  VerModalBillsInfo(bill: BillsEntity) {
    let modalHtml = `
    <style>
        .body-student-modal {
            font-family: 'Arial', sans-serif;
            background: transparent;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #ffffff;
        }



        .details-header h2 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
            color: #ffd700;
            text-shadow: 0 2px 5px rgba(0, 0, 0, 0.7);
            border-bottom: 2px solid #ffd700;
            padding-bottom: 10px;
        }

        .details-content {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-top: 20px;
        }

        .details-info p {
            margin: 0;
            font-size: 18px;
            text-align: left;
        }

        .details-info p strong {
            color: #7ed3f4;
        }

    </style>

    <div class="body-student-modal">
        <div class="details-container">
            <div class="details-header">
                <h2>Details Expense</h2>
            </div>
            <div class="details-content">
                <div class="details-info">
                    <p><strong>ID:</strong> ${bill.id}</p>
                    <p><strong>Fecha:</strong> ${AppUtils.formatDate(bill.date)}</p>
                    <p><strong>Descripción:</strong> ${bill.description}</p>
                    <p><strong>Monto:</strong> ${bill.amount}</p>
                    <p><strong>Categoría:</strong> ${bill.category}</p>
                    <p><strong>Método de Pago:</strong> ${bill.payMethod}</p>
                </div>
            </div>
        </div>
    </div>
    `;

    Swal.fire({
      html: modalHtml,
      showCloseButton: true,
      confirmButtonText: 'Aceptar',
      background: 'linear-gradient(145deg, #1a1a40, #3b3b98, #6a60a9)',
      customClass: {
        popup: 'custom-popup',
      }
    });
  }

  VerModalIncomeInfo(income: IncomeEntity) {
    let modalHtml = `
  <style>
      .body-student-modal {
          font-family: 'Arial', sans-serif;
          background: transparent;
          margin: 0;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #ffffff;
      }

      .details-header h2 {
          margin: 0;
          font-size: 24px;
          font-weight: bold;
          color: #ffd700;
          text-shadow: 0 2px 5px rgba(0, 0, 0, 0.7);
          border-bottom: 2px solid #ffd700;
          padding-bottom: 10px;
      }

      .details-content {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-top: 20px;
      }

      .details-info p {
          margin: 0;
          font-size: 18px;
          text-align: left;
      }

      .details-info p strong {
          color: #7ed3f4;
      }
  </style>

  <div class="body-student-modal">
      <div class="details-container">
          <div class="details-header">
              <h2>Detalles del Ingreso</h2>
          </div>
          <div class="details-content">
              <div class="details-info">
                  <p><strong>ID:</strong> ${income.id}</p>
                  <p><strong>Fecha:</strong> ${AppUtils.formatDate(income.date)}</p>
                  <p><strong>Descripción:</strong> ${income.description}</p>
                  <p><strong>Monto:</strong> ${income.amount}</p>
                  <p><strong>Origen:</strong> ${income.origin}</p>
                  <p><strong>Categoría:</strong> ${income.category}</p>
              </div>
          </div>
      </div>
  </div>
  `;

    Swal.fire({
      html: modalHtml,
      showCloseButton: true,
      confirmButtonText: 'Aceptar',
      background: 'linear-gradient(145deg, #1a1a40, #3b3b98, #6a60a9)',
      customClass: {
        popup: 'custom-popup',
      }
    });
  }

  VerModalSavingInfo(savings: SavingsEntity) {
    let modalHtml = `
    <style>
        .body-student-modal {
            font-family: 'Arial', sans-serif;
            background: transparent;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #ffffff;
        }

        .details-header h2 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
            color: #ffd700;
            text-shadow: 0 2px 5px rgba(0, 0, 0, 0.7);
            border-bottom: 2px solid #ffd700;
            padding-bottom: 10px;
        }

        .details-content {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-top: 20px;
        }

        .details-info p {
            margin: 0;
            font-size: 18px;
            text-align: left;
        }

        .details-info p strong {
            color: #7ed3f4;
        }
    </style>

    <div class="body-student-modal">
        <div class="details-container">
            <div class="details-header">
                <h2>Detalles del Ahorro</h2>
            </div>
            <div class="details-content">
                <div class="details-info">
                    <p><strong>ID:</strong> ${savings.id}</p>
                    <p><strong>Fecha:</strong> ${AppUtils.formatDate(savings.date)}</p>
                    <p><strong>Descripción:</strong> ${savings.description}</p>
                    <p><strong>Monto:</strong> ${savings.amount}</p>
                    <p><strong>Plataforma de Cuenta:</strong> ${savings.accountPlatform}</p>
                </div>
            </div>
        </div>
    </div>
    `;

    Swal.fire({
      html: modalHtml,
      showCloseButton: true,
      confirmButtonText: 'Aceptar',
      background: 'linear-gradient(145deg, #1a1a40, #3b3b98, #6a60a9)',
      customClass: {
        popup: 'custom-popup',
      }
    });
  }

  VerModalImagen(imageUrl: string, title: string = 'Imagen') {
    Swal.fire({
      title: title,
      html: `
      <style>
      .swal2-title-white {
        color: white !important;
      }
      </style>
        <div style="position: relative; margin: 0 auto; max-height: 70vh; overflow: hidden; border-radius: 8px; box-shadow: 0 8px 25px rgba(0,0,0,0.3); background: #000; display: flex; justify-content: center; align-items: center;">
          <img id="modalImage"
               src="${imageUrl}"
               alt="Comprobante del préstamo"
               style="max-width: 100%; max-height: 70vh; object-fit: contain; transition: transform 0.3s ease; cursor: zoom-in; opacity: 0;"
               onload="this.style.opacity=1;">
        </div>

        <p style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.6); text-align: center; margin-top: 0.8rem; font-style: italic;">
          Haz clic en la imagen para acercar/alejar
        </p>

        <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1.5rem;">
          <button id="downloadBtn" style="background: rgba(255,255,255,0.1); border: none; color: white; padding: 0.5rem 1.2rem; border-radius: 50px; font-size: 0.9rem; cursor: pointer; backdrop-filter: blur(5px);">
            ⬇️ Descargar
          </button>
          <button id="printBtn" style="background: rgba(255,255,255,0.1); border: none; color: white; padding: 0.5rem 1.2rem; border-radius: 50px; font-size: 0.9rem; cursor: pointer; backdrop-filter: blur(5px);">
            🖨️ Imprimir
          </button>
        </div>
      `,
      width: '850px',
      background: 'linear-gradient(135deg, #1a1a40 0%, #3b3b98 100%)',
      customClass: { title: 'swal2-title-white' },
      showCloseButton: true,
      showConfirmButton: false,
      backdrop: `rgba(10, 10, 35, 0.9)`,
      didOpen: () => {
        const modalImage = document.getElementById('modalImage') as HTMLImageElement;
        const downloadBtn = document.getElementById('downloadBtn') as HTMLButtonElement;
        const printBtn = document.getElementById('printBtn') as HTMLButtonElement;

        if (modalImage) {
          modalImage.addEventListener('click', () => {
            modalImage.classList.toggle('zoomed');
            if (modalImage.classList.contains('zoomed')) {
              modalImage.style.transform = 'scale(1.5)';
              modalImage.style.cursor = 'zoom-out';
            } else {
              modalImage.style.transform = 'scale(1)';
              modalImage.style.cursor = 'zoom-in';
            }
          });
        }

        if (downloadBtn) {
          downloadBtn.addEventListener('click', () => {
            const printWindow = window.open('', '_blank');
            if (printWindow) {
              printWindow.document.write(`
                <html>
                  <head><title>Comprobante del Préstamo</title></head>
                  <body style="margin:0; padding:0; display:flex; align-items:center; justify-content:center; height:100vh; background:#fff;">
                    <img src="${imageUrl}" style="max-width:100%; max-height:100%;" />
                  </body>
                </html>
              `);
              printWindow.document.close();
            }
          });
        }

        if (printBtn) {
          printBtn.addEventListener('click', async () => {
            const printWindow = window.open('', '_blank');
            if (printWindow) {
              printWindow.document.write(`
                <html>
                  <head><title>Imprimir Comprobante</title></head>
                  <body style="margin:0; padding:0; display:flex; align-items:center; justify-content:center; height:100vh; background:#fff;">
                    <img id="printImage" src="${imageUrl}" style="max-width:100%; max-height:100%;" />
                  </body>
                </html>
              `);
              printWindow.document.close();

              // Esperar a que la imagen cargue antes de imprimir
              const img = printWindow.document.getElementById('printImage') as HTMLImageElement;
              if (img) {
                img.onload = () => {
                  printWindow.focus();
                  printWindow.print();
                  printWindow.close();
                };
              } else {
                // Si falla cargar, intentar imprimir de inmediato
                printWindow.focus();
                printWindow.print();
                printWindow.close();
              }
            }
          });
        }

      }
    });
  }

  VerModalDebtsInfo(debt: DebtsEntity) {
    let modalHtml = `
    <style>
        .debt-modal {
            font-family: 'Poppins', 'Segoe UI', system-ui, sans-serif;
            background: transparent;
            color: #ffffff;
            width: 100%;
            max-width: 600px;
        }

        .debt-header {
            text-align: center;
            margin-bottom: 1.5rem;
            position: relative;
            padding-bottom: 1rem;
        }

        .debt-header h2 {
            margin: 0;
            font-size: 1.8rem;
            font-weight: 600;
            color: #fff;
            position: relative;
            display: inline-block;
        }

        .debt-header h2:after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 3px;
            background: linear-gradient(90deg, #ffd700, #ff8c00);
            border-radius: 3px;
        }

        .debt-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.2rem;
        }

        .debt-info-item {
            margin-bottom: 0.8rem;
        }

        .debt-info-label {
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 0.2rem;
            font-weight: 400;
        }

        .debt-info-value {
            font-size: 1rem;
            font-weight: 500;
            color: #fff;
            word-break: break-word;
        }

        .debt-amount {
            font-size: 1.4rem;
            font-weight: 700;
            color: #ff6b6b;
        }

        .debt-image-container {
            grid-column: span 2;
            margin-top: 1rem;
            display: flex;
            justify-content: center;
        }

        .debt-image {
            max-width: 100%;
            max-height: 200px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: transform 0.3s ease;
        }

        .debt-image:hover {
            transform: scale(1.02);
        }

        .urgency-indicator {
            position: absolute;
            top: 0;
            right: 0;
            background: ${this.getUrgencyColor(debt.dateMaturity)};
            color: white;
            padding: 0.3rem 0.6rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }

        .progress-container {
            grid-column: span 2;
            margin-top: 0.5rem;
        }

        .progress-label {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.3rem;
            font-size: 0.85rem;
        }

        .progress-bar {
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4facfe, #00f2fe);
            border-radius: 4px;
            width: ${this.calculateProgress(debt.date, debt.dateMaturity)}%;
        }
    </style>

    <div class="debt-modal">
        <div class="debt-header">
            <h2>Detalles del Préstamo</h2>
            <div class="urgency-indicator">${this.getUrgencyText(debt.dateMaturity)}</div>
        </div>

        <div class="debt-content">
            <div class="debt-info-item">
                <div class="debt-info-label">ID del Préstamo</div>
                <div class="debt-info-value">${debt.id}</div>
            </div>

            <div class="debt-info-item">
                <div class="debt-info-label">Fecha de Creación</div>
                <div class="debt-info-value">${AppUtils.formatDate(debt.date)}</div>
            </div>

            <div class="debt-info-item" style="grid-column: span 2;">
                <div class="debt-info-label">Descripción</div>
                <div class="debt-info-value">${debt.description || 'No especificada'}</div>
            </div>

            <div class="debt-info-item">
                <div class="debt-info-label">Monto</div>
                <div class="debt-info-value debt-amount">$${debt.amount.toLocaleString()}</div>
            </div>

            <div class="debt-info-item">
                <div class="debt-info-label">Tasa de Interés</div>
                <div class="debt-info-value">${debt.interestRate}%</div>
            </div>

            <div class="debt-info-item">
                <div class="debt-info-label">Acreedor</div>
                <div class="debt-info-value">${debt.creditor}</div>
            </div>

            <div class="debt-info-item">
                <div class="debt-info-label">Fecha de Vencimiento</div>
                <div class="debt-info-value">${AppUtils.formatDate(debt.dateMaturity)}</div>
            </div>

            <div class="progress-container">
                <div class="progress-label">
                    <span>Progreso</span>
                    <span>${this.calculateProgress(debt.date, debt.dateMaturity)}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
            </div>

            ${debt.imageUrl ? `
            <div class="debt-image-container">
                <img src="${debt.imageUrl}" alt="Comprobante del préstamo" class="debt-image">
            </div>
            ` : ''}
        </div>
    </div>
    `;

    Swal.fire({
      html: modalHtml,
      width: '650px',
      padding: '2rem',
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#6a60a9',
      background: 'linear-gradient(135deg, #1e1e4a 0%, #2d2b6e 100%)',
      backdrop: `
        rgba(10, 10, 35, 0.8)
      `,
      customClass: {
        popup: 'debt-modal-popup',
        closeButton: 'debt-modal-close-btn'
      }
    });
  }

  // Métodos auxiliares para calcular el estado del préstamo
  private getUrgencyColor(dateMaturity: string): string {
    const today = new Date();
    const maturityDate = new Date(dateMaturity);
    const diffTime = maturityDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return '#ff4757'; // Vencido
    if (diffDays <= 7) return '#ff7f50'; // Urgente (menos de 7 días)
    if (diffDays <= 30) return '#feca57'; // Próximo (menos de 30 días)
    return '#2ecc71'; // A tiempo (más de 30 días)
  }

  private getUrgencyText(dateMaturity: string): string {
    const today = new Date();
    const maturityDate = new Date(dateMaturity);
    const diffTime = maturityDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'VENCIDO';
    if (diffDays <= 7) return 'URGENTE';
    if (diffDays <= 30) return 'PRÓXIMO';
    return 'A TIEMPO';
  }

  private calculateProgress(startDate: string, endDate: string): number {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();

    if (now >= end) return 100;
    if (now <= start) return 0;

    const total = end - start;
    const elapsed = now - start;

    return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
  }
}
