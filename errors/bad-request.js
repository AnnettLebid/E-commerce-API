import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "./custom-api.js";

export class BadRequest extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
