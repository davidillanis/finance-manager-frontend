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

  VerModalDebtsInfo(debt: DebtsEntity) {
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
                <h2>Detalles de la Deuda</h2>
            </div>
            <div class="details-content">
                <div class="details-info">
                    <p><strong>ID:</strong> ${debt.id}</p>
                    <p><strong>Fecha:</strong> ${AppUtils.formatDate(debt.date)}</p>
                    <p><strong>Descripción:</strong> ${debt.description}</p>
                    <p><strong>Monto:</strong> ${debt.amount}</p>
                    <p><strong>Acreedor:</strong> ${debt.creditor}</p>
                    <p><strong>Fecha de Vencimiento:</strong> ${AppUtils.formatDate(debt.dateMaturity)}</p>
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


}
