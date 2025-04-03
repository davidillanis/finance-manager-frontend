export class AppUtils {
  private constructor(){}

  static getCurrentDate(): string {
    const now = new Date();
    return now.toISOString().replace("T", " ").substring(0, 10); // Formato: YYYY-MM-DD HH:mm:ss
  }

  static formatDate(timestamp: number | string) {
    const date = new Date(timestamp);
    return date.toISOString().replace("T", " ").split(".")[0];
  }
}
