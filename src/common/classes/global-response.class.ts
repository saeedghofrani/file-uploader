export class GlobalResponseClass {
  status: string;
  timestamp: Date;
  data: JSON;
  statusCode: number;
  constructor(staus: string, statusCode: number, data) {
    this.timestamp = new Date(Date.now());
    this.status = staus;
    this.data = data;
    this.statusCode = statusCode;
  }
}
