import core from "express-serve-static-core";

declare module "express-serve-static-core" {
  export interface Response {
    success(data: any): void;
    error(message: string, statusCode?: number): void;
  }
}
