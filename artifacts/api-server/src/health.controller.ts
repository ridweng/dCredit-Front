import { Controller, Get } from "@nestjs/common";
import { HealthCheckResponse } from "@workspace/api-zod";

@Controller("healthz")
export class HealthController {
  @Get()
  getHealth() {
    return HealthCheckResponse.parse({ status: "ok" });
  }
}
